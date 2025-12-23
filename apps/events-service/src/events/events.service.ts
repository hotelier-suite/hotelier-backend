import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventBooking } from './entities/event-booking.entity';
import { Venue } from '../venues/entities/venue.entity';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service/events/dto';
import { VenueDto } from '@app/contracts/events-service/venues/dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventBooking)
    private readonly eventBookingRepository: Repository<EventBooking>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  // Event methods
  async create(data: CreateEventDto): Promise<EventDto> {
    const event = await this.eventRepository.save({
      ...data,
      eventDate: new Date(data.eventDate),
    });
    return this.toEventDto(event);
  }

  async findAllEvents(): Promise<EventDto[]> {
    const events = await this.eventRepository.find({
      order: { eventDate: 'ASC' },
    });
    return events.map((event) => this.toEventDto(event));
  }

  async findOneEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return this.toEventDto(event);
  }

  async update(id: number, data: UpdateEventDto): Promise<EventDto> {
    const updateData = {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    };
    await this.eventRepository.update(id, updateData);
    return this.findOneEvent(id);
  }

  async deleteEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    const dto = this.toEventDto(event);
    await this.eventRepository.remove(event);
    return dto;
  }

  // Event Booking methods
  async createBooking(data: CreateEventBookingDto): Promise<EventBookingDto> {
    const venue = await this.venueRepository.findOne({
      where: { id: data.venueId },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with id ${data.venueId} not found`);
    }

    const eventDate = new Date(data.eventDate);
    const totalCost = this.calculateBookingCost(
      Number(venue.hourlyRate),
      data.startTime,
      data.endTime,
    );

    const booking = await this.eventBookingRepository.save({
      ...data,
      eventDate,
      totalCost,
    });

    const savedBooking = await this.eventBookingRepository.findOne({
      where: { id: booking.id },
      relations: { venue: true },
    });

    return this.toBookingDto(savedBooking!);
  }

  async findAllBookings(): Promise<EventBookingDto[]> {
    const bookings = await this.eventBookingRepository.find({
      relations: { venue: true },
      order: { eventDate: 'ASC' },
    });
    return bookings.map((booking) => this.toBookingDto(booking));
  }

  async findOneBooking(id: number): Promise<EventBookingDto> {
    const booking = await this.eventBookingRepository.findOne({
      where: { id },
      relations: { venue: true },
    });
    if (!booking) {
      throw new NotFoundException(`Event booking with id ${id} not found`);
    }
    return this.toBookingDto(booking);
  }

  async updateBooking(
    id: number,
    data: UpdateEventBookingDto,
  ): Promise<EventBookingDto> {
    const existing = await this.eventBookingRepository.findOne({
      where: { id },
      relations: { venue: true },
    });
    if (!existing) {
      throw new NotFoundException(`Event booking with id ${id} not found`);
    }

    const eventDate = data.eventDate
      ? new Date(data.eventDate)
      : existing.eventDate;
    const startTime = data.startTime ?? existing.startTime;
    const endTime = data.endTime ?? existing.endTime;
    const venueId = data.venueId ?? existing.venueId;

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with id ${venueId} not found`);
    }

    const totalCost = this.calculateBookingCost(
      Number(venue.hourlyRate),
      startTime,
      endTime,
    );

    await this.eventBookingRepository.update(id, {
      ...data,
      eventDate,
      totalCost,
    });

    return this.findOneBooking(id);
  }

  async deleteBooking(id: number): Promise<EventBookingDto> {
    const booking = await this.eventBookingRepository.findOne({
      where: { id },
      relations: { venue: true },
    });
    if (!booking) {
      throw new NotFoundException(`Event booking with id ${id} not found`);
    }
    const dto = this.toBookingDto(booking);
    await this.eventBookingRepository.remove(booking);
    return dto;
  }

  async getUpcomingBookings(): Promise<EventBookingDto[]> {
    const now = new Date();
    const bookings = await this.eventBookingRepository.find({
      where: {
        eventDate: MoreThanOrEqual(now),
      },
      relations: { venue: true },
      order: { eventDate: 'ASC' },
    });
    return bookings.map((booking) => this.toBookingDto(booking));
  }

  private calculateBookingCost(
    hourlyRate: number,
    startTime: string,
    endTime: string,
  ): number {
    const [sh, sm] = String(startTime)
      .split(':')
      .map((x) => parseInt(x, 10));
    const [eh, em] = String(endTime)
      .split(':')
      .map((x) => parseInt(x, 10));
    if (
      Number.isNaN(sh) ||
      Number.isNaN(sm) ||
      Number.isNaN(eh) ||
      Number.isNaN(em)
    ) {
      throw new Error('Invalid startTime or endTime format. Expected HH:MM');
    }
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const durationMinutes = Math.max(0, endMinutes - startMinutes);
    const durationHours = durationMinutes / 60;
    const base = hourlyRate * durationHours;
    return Math.round(base * 100) / 100;
  }

  private toEventDto(event: Event): EventDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      capacity: event.capacity,
      attendees: event.attendees,
      status: event.status,
      organizer: event.organizer,
      cost: event.cost ? Number(event.cost) : undefined,
      revenue: event.revenue ? Number(event.revenue) : undefined,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  private toBookingDto(booking: EventBooking): EventBookingDto {
    const dto: EventBookingDto = {
      id: booking.id,
      title: booking.title,
      description: booking.description,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      attendees: booking.attendees,
      totalCost: Number(booking.totalCost),
      status: booking.status,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      notes: booking.notes,
      venueId: booking.venueId,
      guestId: booking.guestId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    if (booking.venue) {
      dto.venue = {
        id: booking.venue.id,
        name: booking.venue.name,
        capacity: booking.venue.capacity,
        area: Number(booking.venue.area),
        hourlyRate: Number(booking.venue.hourlyRate),
        available: booking.venue.available,
        location: booking.venue.location,
        description: booking.venue.description,
        createdAt: booking.venue.createdAt,
        updatedAt: booking.venue.updatedAt,
      } as VenueDto;
    }

    return dto;
  }
}

import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';
import { Event, EventBooking } from './entities';
import { Venue } from '../venues';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

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

  private readonly eventReadSelect: FindOptionsSelect<Event> = {
    id: true,
    title: true,
    description: true,
    eventDate: true,
    startTime: true,
    endTime: true,
    venue: true,
    capacity: true,
    attendees: true,
    status: true,
    organizer: true,
    cost: true,
    revenue: true,
    createdAt: true,
    updatedAt: true,
  };

  private readonly bookingReadSelect: FindOptionsSelect<EventBooking> = {
    id: true,
    title: true,
    description: true,
    eventDate: true,
    startTime: true,
    endTime: true,
    attendees: true,
    totalCost: true,
    status: true,
    clientName: true,
    clientEmail: true,
    clientPhone: true,
    notes: true,
    venueId: true,
    guestId: true,
    createdAt: true,
    updatedAt: true,
    venue: {
      id: true,
      name: true,
      capacity: true,
      area: true,
      hourlyRate: true,
      available: true,
      location: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  private readonly bookingReadRelations: FindOptionsRelations<EventBooking> = {
    venue: true,
  };

  // Event methods
  async create(data: CreateEventDto): Promise<EventDto> {
    const event = await this.eventRepository.save({
      ...data,
      eventDate: new Date(data.eventDate),
    });

    const loaded = await this.eventRepository.findOne({
      where: { id: event.id },
      select: this.eventReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load event with id ${event.id} after creation`,
      });
    }

    return loaded;
  }

  findAllEvents(): Promise<EventDto[]> {
    return this.eventRepository.find({
      select: this.eventReadSelect,
      order: { eventDate: 'ASC' },
    });
  }

  async findOneEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: this.eventReadSelect,
    });

    if (!event) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    return event;
  }

  async update(id: number, data: UpdateEventDto): Promise<EventDto> {
    const existing = await this.eventRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    const updateData = {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    };

    await this.eventRepository.update(id, updateData);
    return this.findOneEvent(id);
  }

  async deleteEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: this.eventReadSelect,
    });

    if (!event) {
      throw new RpcException({
        statusCode: 404,
        message: `Event with id ${id} not found`,
      });
    }

    await this.eventRepository.remove(event);
    return event;
  }

  // Event Booking methods
  async createBooking(data: CreateEventBookingDto): Promise<EventBookingDto> {
    const venue = await this.venueRepository.findOne({
      where: { id: data.venueId },
    });

    if (!venue) {
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${data.venueId} not found`,
      });
    }

    const eventDate = new Date(data.eventDate);
    const totalCost = this.calculateBookingCost(
      venue.hourlyRate,
      data.startTime,
      data.endTime,
    );

    const booking = await this.eventBookingRepository.save({
      ...data,
      eventDate,
      totalCost,
    });

    const loaded = await this.eventBookingRepository.findOne({
      where: { id: booking.id },
      select: this.bookingReadSelect,
      relations: this.bookingReadRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load booking with id ${booking.id} after creation`,
      });
    }

    return loaded;
  }

  findAllBookings(): Promise<EventBookingDto[]> {
    return this.eventBookingRepository.find({
      select: this.bookingReadSelect,
      relations: this.bookingReadRelations,
      order: { eventDate: 'ASC' },
    });
  }

  async findOneBooking(id: number): Promise<EventBookingDto> {
    const booking = await this.eventBookingRepository.findOne({
      where: { id },
      select: this.bookingReadSelect,
      relations: this.bookingReadRelations,
    });

    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Event booking with id ${id} not found`,
      });
    }

    return booking;
  }

  async updateBooking(
    id: number,
    data: UpdateEventBookingDto,
  ): Promise<EventBookingDto> {
    const existing = await this.eventBookingRepository.findOne({
      where: { id },
      relations: this.bookingReadRelations,
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Event booking with id ${id} not found`,
      });
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
      throw new RpcException({
        statusCode: 404,
        message: `Venue with id ${venueId} not found`,
      });
    }

    const totalCost = this.calculateBookingCost(
      venue.hourlyRate,
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
      select: this.bookingReadSelect,
      relations: this.bookingReadRelations,
    });

    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Event booking with id ${id} not found`,
      });
    }

    await this.eventBookingRepository.remove(booking);
    return booking;
  }

  getUpcomingBookings(): Promise<EventBookingDto[]> {
    const now = new Date();
    return this.eventBookingRepository.find({
      where: {
        eventDate: MoreThanOrEqual(now),
      },
      select: this.bookingReadSelect,
      relations: this.bookingReadRelations,
      order: { eventDate: 'ASC' },
    });
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
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid startTime or endTime format. Expected HH:MM',
      });
    }

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const durationMinutes = Math.max(0, endMinutes - startMinutes);
    const durationHours = durationMinutes / 60;
    const base = hourlyRate * durationHours;
    return Math.round(base * 100) / 100;
  }
}

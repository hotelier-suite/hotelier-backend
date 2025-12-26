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
    const event = await this.eventRepository.save(data);

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

    await this.eventRepository.update(id, data);
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

    const totalCost = this.calculateBookingCost(
      venue.hourlyRate,
      data.startTime,
      data.endTime,
    );

    const booking = await this.eventBookingRepository.save({
      ...data,
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
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationHours = (endTotalMinutes - startTotalMinutes) / 60;

    if (durationHours < 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'End time must be after start time',
      });
    }

    const base = hourlyRate * durationHours;
    return Math.round(base * 100) / 100;
  }
}

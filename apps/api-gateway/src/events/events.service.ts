import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventBooking } from './entities/event-booking.entity';
import { Venue } from '../venues/entities/venue.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventBookingDto } from './dto/create-event-booking.dto';
import { UpdateEventBookingDto } from './dto/update-event-booking.dto';

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

  async create(data: CreateEventDto): Promise<Event> {
    return this.eventRepository.save({
      ...data,
      eventDate: new Date(data.eventDate),
    });
  }

  async createBooking(data: CreateEventBookingDto): Promise<EventBooking> {
    // Load venue to get hourly rate
    const venue = await this.venueRepository.findOne({
      where: { id: data.venueId },
    });
    if (!venue) {
      throw new NotFoundException(`Venue with id ${data.venueId} not found`);
    }

    const eventDate = new Date(data.eventDate);
    const totalCost = this.calculateBookingCost(
      venue.hourlyRate,
      data.startTime,
      data.endTime,
    );

    return this.eventBookingRepository.save({
      ...data,
      eventDate,
      totalCost,
    });
  }

  async findAll(): Promise<EventBooking[]> {
    return this.eventBookingRepository.find({
      relations: {
        venue: true,
      },
      order: { eventDate: 'ASC' },
    });
  }

  async findAllEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      order: { eventDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventBooking | null> {
    return this.eventBookingRepository.findOne({
      where: { id },
      relations: {
        venue: true,
      },
    });
  }

  async findOneEvent(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, data: UpdateEventDto): Promise<Event> {
    const updateData = {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    };
    await this.eventRepository.update(id, updateData);
    const updated = await this.findOneEvent(id);
    if (!updated) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return updated;
  }

  async updateBooking(
    id: number,
    data: UpdateEventBookingDto,
  ): Promise<EventBooking> {
    const existing = await this.findOne(id);
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
      venue.hourlyRate,
      startTime,
      endTime,
    );

    await this.eventBookingRepository.update(id, {
      ...data,
      eventDate,
      totalCost,
    });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Event booking with id ${id} not found`);
    }
    return updated;
  }

  private calculateBookingCost(
    hourlyRate: number,
    startTime: string,
    endTime: string,
  ): number {
    // Parse HH:MM (24h)
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
    const base = Number(hourlyRate) * durationHours;
    // Round to 2 decimals
    return Math.round(base * 100) / 100;
  }

  async delete(id: number): Promise<EventBooking> {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException(`Event booking with id ${id} not found`);
    }
    await this.eventBookingRepository.remove(booking);
    return booking;
  }

  async deleteEvent(id: number): Promise<Event> {
    const event = await this.findOneEvent(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    await this.eventRepository.remove(event);
    return event;
  }

  async getUpcomingEvents(): Promise<EventBooking[]> {
    const now = new Date();
    return this.eventBookingRepository.find({
      where: {
        eventDate: MoreThanOrEqual(now),
      },
      relations: {
        venue: true,
      },
      order: { eventDate: 'ASC' },
    });
  }
}

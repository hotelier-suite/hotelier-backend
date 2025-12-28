import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';
import { EventBooking } from './entities';
import { Venue } from '../venues';
import {
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
  FindEventBookingsFilterDto,
} from '@app/contracts/events-service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(EventBooking)
    private readonly bookingRepository: Repository<EventBooking>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  private readonly readSelect: FindOptionsSelect<EventBooking> = {
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

  private readonly readRelations: FindOptionsRelations<EventBooking> = {
    venue: true,
  };

  findAll(filters: FindEventBookingsFilterDto): Promise<EventBookingDto[]> {
    const where: FindOptionsWhere<EventBooking> = {};

    if (filters.isUpcoming) {
      const now = new Date();
      where.eventDate = MoreThanOrEqual(now);
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.guestId) {
      where.guestId = filters.guestId;
    }

    if (filters.venueId) {
      where.venueId = filters.venueId;
    }

    if (filters.startDate && filters.endDate) {
      where.eventDate = Between(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
      where.eventDate = MoreThanOrEqual(filters.startDate);
    } else if (filters.endDate) {
      where.eventDate = LessThanOrEqual(filters.endDate);
    }

    return this.bookingRepository.find({
      where,
      select: this.readSelect,
      relations: this.readRelations,
      order: { eventDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      select: this.readSelect,
      relations: this.readRelations,
    });

    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Event booking with id ${id} not found`,
      });
    }

    return booking;
  }

  async create(data: CreateEventBookingDto): Promise<EventBookingDto> {
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

    const booking = await this.bookingRepository.save({
      ...data,
      totalCost,
    });

    const loaded = await this.bookingRepository.findOne({
      where: { id: booking.id },
      select: this.readSelect,
      relations: this.readRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load booking with id ${booking.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: UpdateEventBookingDto,
  ): Promise<EventBookingDto> {
    const existing = await this.bookingRepository.findOne({
      where: { id },
      relations: this.readRelations,
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

    await this.bookingRepository.update(id, {
      ...data,
      totalCost,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<EventBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      select: this.readSelect,
      relations: this.readRelations,
    });

    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Event booking with id ${id} not found`,
      });
    }

    await this.bookingRepository.remove(booking);
    return booking;
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

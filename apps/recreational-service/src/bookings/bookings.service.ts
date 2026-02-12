import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsSelect,
  FindOptionsRelations,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { RecreationalBooking } from './entities';
import { RecreationalFacility } from '../facilities/entities';
import { NotificationsService } from '../notifications-service';
import { NotificationType } from '@app/contracts/notifications-service';
import {
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  RecreationalBookingDto,
  BookingStatisticsDto,
  FacilityUsageStatsDto,
  BookingStatusBreakdownDto,
  RecreationalBookingStatus,
  FacilityStatus,
  FindRecreationalBookingsFilterDto,
} from '@app/contracts/recreational-service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(RecreationalBooking)
    private readonly recreationalBookingRepository: Repository<RecreationalBooking>,
    @InjectRepository(RecreationalFacility)
    private readonly recreationalFacilityRepository: Repository<RecreationalFacility>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private readonly recreationalBookingSelect: FindOptionsSelect<RecreationalBooking> =
    {
      id: true,
      facilityId: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      roomNumber: true,
      bookingDate: true,
      startTime: true,
      endTime: true,
      duration: true,
      participants: true,
      totalCost: true,
      status: true,
      priority: true,
      specialRequests: true,
      staffNotes: true,
      actualCheckIn: true,
      actualCheckOut: true,
      discountPercent: true,
      discountAmount: true,
      createdByUserId: true,
      createdAt: true,
      updatedAt: true,
      facility: {
        id: true,
        name: true,
        type: true,
        location: true,
      },
    };

  private readonly recreationalBookingRelations: FindOptionsRelations<RecreationalBooking> =
    {
      facility: true,
    };

  findAll(
    filters: FindRecreationalBookingsFilterDto,
  ): Promise<RecreationalBookingDto[]> {
    const where: FindOptionsWhere<RecreationalBooking> = {};

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      where.bookingDate = Between(startOfDay, endOfDay);
    }

    if (filters.facilityId) {
      where.facilityId = filters.facilityId;
    }

    return this.recreationalBookingRepository.find({
      where,
      select: this.recreationalBookingSelect,
      relations: this.recreationalBookingRelations,
      order: { bookingDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.recreationalBookingRepository.findOne({
      where: { id },
      select: this.recreationalBookingSelect,
      relations: this.recreationalBookingRelations,
    });

    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }

    return booking as unknown as RecreationalBookingDto;
  }

  async create(
    data: CreateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    const facility = await this.recreationalFacilityRepository.findOne({
      where: { id: data.facilityId },
    });

    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${data.facilityId} not found`,
      });
    }

    this.validateFacilityAvailability(
      facility,
      data.bookingDate,
      data.startTime,
      data.endTime,
    );

    await this.checkBookingConflicts(
      data.facilityId,
      data.bookingDate,
      data.startTime,
      data.endTime,
    );

    if (data.participants > facility.capacity) {
      throw new RpcException({
        statusCode: 400,
        message: `Number of participants (${data.participants}) exceeds facility capacity (${facility.capacity})`,
      });
    }

    const entity = this.recreationalBookingRepository.create(data);
    const saved = await this.recreationalBookingRepository.save(entity);

    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'Recreational Booking Created',
        message: `New booking for ${facility.name} on ${data.bookingDate.toISOString().split('T')[0]} from ${data.startTime} to ${data.endTime}`,
        refId: saved.id,
        refType: 'recreational_booking',
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return saved;
  }

  async update(
    id: number,
    data: UpdateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    const booking = await this.findOne(id);

    if (data.bookingDate || data.startTime || data.endTime || data.facilityId) {
      const facilityId = data.facilityId || booking.facilityId;
      const facility = await this.recreationalFacilityRepository.findOne({
        where: { id: facilityId },
      });

      if (!facility) {
        throw new RpcException({
          statusCode: 404,
          message: `Recreational facility with ID ${facilityId} not found`,
        });
      }

      const bookingDate = data.bookingDate || booking.bookingDate;
      const startTime = data.startTime || booking.startTime;
      const endTime = data.endTime || booking.endTime;

      this.validateFacilityAvailability(
        facility,
        bookingDate,
        startTime,
        endTime,
      );

      await this.checkBookingConflicts(
        facilityId,
        bookingDate,
        startTime,
        endTime,
        id,
      );
    }

    const entity = this.recreationalBookingRepository.create(booking);
    const merged = this.recreationalBookingRepository.merge(entity, {
      ...data,
      totalCost: 0,
    });

    return this.recreationalBookingRepository.save(merged);
  }

  async remove(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.findOne(id);
    const entity = this.recreationalBookingRepository.create(booking);
    return this.recreationalBookingRepository.remove(entity);
  }

  async cancel(id: number, reason?: string): Promise<RecreationalBookingDto> {
    const booking = await this.findOne(id);

    if (booking.status === RecreationalBookingStatus.COMPLETED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Cannot cancel a completed booking',
      });
    }

    const bookingEntity = this.recreationalBookingRepository.create(booking);
    bookingEntity.status = RecreationalBookingStatus.CANCELLED;
    bookingEntity.staffNotes = reason
      ? `Cancelled: ${reason}`
      : 'Booking cancelled';

    const saved = await this.recreationalBookingRepository.save(bookingEntity);

    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'Recreational Booking Cancelled',
        message: `Booking for ${bookingEntity.facility.name} on ${bookingEntity.bookingDate instanceof Date ? bookingEntity.bookingDate.toISOString().split('T')[0] : String(bookingEntity.bookingDate)} has been cancelled`,
        refId: saved.id,
        refType: 'recreational_booking',
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return saved;
  }

  async checkIn(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.findOne(id);

    if (booking.status !== RecreationalBookingStatus.CONFIRMED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Only confirmed bookings can be checked in',
      });
    }

    const entity = this.recreationalBookingRepository.create(booking);
    entity.status = RecreationalBookingStatus.CHECKED_IN;
    entity.actualCheckIn = new Date();

    return this.recreationalBookingRepository.save(entity);
  }

  async checkOut(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.findOne(id);

    if (booking.status !== RecreationalBookingStatus.CHECKED_IN) {
      throw new RpcException({
        statusCode: 400,
        message: 'Only checked-in bookings can be checked out',
      });
    }

    const entity = this.recreationalBookingRepository.create(booking);
    entity.status = RecreationalBookingStatus.COMPLETED;
    entity.actualCheckOut = new Date();

    return this.recreationalBookingRepository.save(entity);
  }

  async getStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<BookingStatisticsDto> {
    const bookings = await this.recreationalBookingRepository.find({
      where: {
        bookingDate: Between(startDate, endDate),
      },
      relations: ['facility'],
    });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + Number(booking.totalCost),
      0,
    );
    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const statusBreakdown = bookings.reduce((acc, booking) => {
      const status = booking.status || RecreationalBookingStatus.PENDING;
      switch (status) {
        case RecreationalBookingStatus.PENDING:
          acc.pending = (acc.pending || 0) + 1;
          break;
        case RecreationalBookingStatus.CONFIRMED:
          acc.confirmed = (acc.confirmed || 0) + 1;
          break;
        case RecreationalBookingStatus.CHECKED_IN:
          acc.checkedIn = (acc.checkedIn || 0) + 1;
          break;
        case RecreationalBookingStatus.COMPLETED:
          acc.completed = (acc.completed || 0) + 1;
          break;
        case RecreationalBookingStatus.CANCELLED:
          acc.cancelled = (acc.cancelled || 0) + 1;
          break;
        case RecreationalBookingStatus.NO_SHOW:
          acc.noShow = (acc.noShow || 0) + 1;
          break;
      }
      return acc;
    }, {} as BookingStatusBreakdownDto);

    const facilityTypeCounts = bookings.reduce(
      (acc, booking) => {
        const type = booking.facility.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostPopularFacilityType =
      Object.entries(facilityTypeCounts).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0] || '';

    const hourCounts = bookings.reduce(
      (acc, booking) => {
        const hour = booking.startTime.substring(0, 5);
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const peakHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => hour);

    const facilityStats = await this.getFacilityUsageStats(startDate, endDate);

    return {
      totalBookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageBookingValue: Math.round(averageBookingValue * 100) / 100,
      mostPopularFacilityType,
      peakHour: peakHours[0] || '12:00',
      facilitiesUsage: facilityStats,
      statusBreakdown,
      period: {
        startDate,
        endDate,
      },
    };
  }

  private validateFacilityAvailability(
    facility: RecreationalFacility,
    date: Date,
    startTime: string,
    endTime: string,
  ): void {
    if (!facility.available || facility.status !== FacilityStatus.AVAILABLE) {
      throw new RpcException({
        statusCode: 400,
        message: 'Facility is not available for booking',
      });
    }

    const dayOfWeek = date.getDay();
    if (facility.availableDays && !facility.availableDays.includes(dayOfWeek)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Facility is not available on this day of the week',
      });
    }

    if (startTime < facility.openingTime || endTime > facility.closingTime) {
      throw new RpcException({
        statusCode: 400,
        message: `Booking time must be within operating hours (${facility.openingTime} - ${facility.closingTime})`,
      });
    }

    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (
      duration < facility.minimumBookingHours ||
      duration > facility.maximumBookingHours
    ) {
      throw new RpcException({
        statusCode: 400,
        message: `Booking duration must be between ${facility.minimumBookingHours} and ${facility.maximumBookingHours} hours`,
      });
    }
  }

  private async checkBookingConflicts(
    facilityId: number,
    date: Date,
    startTime: string,
    endTime: string,
    excludeBookingId?: number,
  ): Promise<void> {
    const qb = this.recreationalBookingRepository
      .createQueryBuilder('booking')
      .where('booking.facilityId = :facilityId', { facilityId })
      .andWhere('booking.bookingDate = :date', { date })
      .andWhere('booking.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [
          RecreationalBookingStatus.CANCELLED,
          RecreationalBookingStatus.NO_SHOW,
        ],
      })
      .andWhere(
        `(
          (booking.startTime <= :startTime AND booking.endTime > :startTime) OR
          (booking.startTime < :endTime AND booking.endTime >= :endTime) OR
          (booking.startTime >= :startTime AND booking.endTime <= :endTime)
        )`,
        { startTime, endTime },
      );

    if (excludeBookingId) {
      qb.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBookings = await qb.getMany();

    if (conflictingBookings.length > 0) {
      throw new RpcException({
        statusCode: 409,
        message: `The ${startTime} time slot is not available because a booking already exists.`,
      });
    }
  }

  private async getFacilityUsageStats(
    startDate: Date,
    endDate: Date,
  ): Promise<FacilityUsageStatsDto[]> {
    const facilities = await this.recreationalFacilityRepository.find();
    const stats: FacilityUsageStatsDto[] = [];

    for (const facility of facilities) {
      const bookings = await this.recreationalBookingRepository.find({
        where: {
          facilityId: facility.id,
          bookingDate: Between(startDate, endDate),
        },
      });

      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + Number(booking.totalCost),
        0,
      );
      const averageDuration =
        totalBookings > 0
          ? bookings.reduce(
              (sum, booking) => sum + Number(booking.duration),
              0,
            ) / totalBookings
          : 0;

      const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const operatingHours = this.calculateDailyOperatingHours(facility);
      const totalPossibleHours = totalDays * operatingHours;
      const bookedHours = bookings.reduce(
        (sum, booking) => sum + Number(booking.duration),
        0,
      );
      const utilizationRate =
        totalPossibleHours > 0 ? (bookedHours / totalPossibleHours) * 100 : 0;

      stats.push({
        facilityId: facility.id,
        facilityName: facility.name,
        facilityType: facility.type,
        totalBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageDuration: Math.round(averageDuration * 100) / 100,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
      });
    }

    return stats.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private calculateDailyOperatingHours(facility: RecreationalFacility): number {
    const [openingHours, openingMinutes] = facility.openingTime
      .split(':')
      .map(Number);
    const [closingHours, closingMinutes] = facility.closingTime
      .split(':')
      .map(Number);

    const openingTimeInMinutes = openingHours * 60 + openingMinutes;
    const closingTimeInMinutes = closingHours * 60 + closingMinutes;

    return (closingTimeInMinutes - openingTimeInMinutes) / 60;
  }
}

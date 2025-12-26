import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, And, Not } from 'typeorm';
import { RecreationalFacility, RecreationalBooking } from './entities';
import { NotificationsService } from '../notifications-service';
import { NotificationType } from '@app/contracts/notifications-service';
import {
  CreateRecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
  RecreationalFacilityDto,
  FacilityAvailabilityDto,
  TimeSlotDto,
  FacilityType,
  FacilityStatus,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  RecreationalBookingDto,
  BookingStatisticsDto,
  FacilityUsageStatsDto,
  RecreationalBookingStatus,
} from '@app/contracts/recreational-service';

@Injectable()
export class RecreationalService {
  constructor(
    @InjectRepository(RecreationalFacility)
    private readonly facilityRepository: Repository<RecreationalFacility>,
    @InjectRepository(RecreationalBooking)
    private readonly bookingRepository: Repository<RecreationalBooking>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Facility Management
  async createFacility(
    data: CreateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    const facility = this.facilityRepository.create(data);
    const saved = await this.facilityRepository.save(facility);

    // Notify administrators about new facility
    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'New Recreational Facility Added',
        message: `New ${data.type.toLowerCase()} facility "${data.name}" has been added to the system.`,
        refId: saved.id,
        refType: 'recreational_facility',
      })
      .subscribe({
        error: (error) => {
          console.error(
            'Error creating recreational facility notification:',
            error,
          );
        },
      });

    return saved as RecreationalFacilityDto;
  }

  async findAllFacilities(): Promise<RecreationalFacilityDto[]> {
    const facilities = await this.facilityRepository.find({
      relations: ['bookings'],
      order: { name: 'ASC' },
    });
    return facilities as RecreationalFacilityDto[];
  }

  async findOneFacility(id: number): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }
    return facility as RecreationalFacilityDto;
  }

  async findAvailableFacilities(): Promise<RecreationalFacilityDto[]> {
    const facilities = await this.facilityRepository.find({
      where: {
        isAvailable: true,
        status: FacilityStatus.AVAILABLE,
      },
      order: { name: 'ASC' },
    });
    return facilities as RecreationalFacilityDto[];
  }

  async findFacilitiesByType(
    type: FacilityType,
  ): Promise<RecreationalFacilityDto[]> {
    const facilities = await this.facilityRepository.find({
      where: { type },
      order: { name: 'ASC' },
    });
    return facilities as RecreationalFacilityDto[];
  }

  async updateFacility(
    id: number,
    data: UpdateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.findOne({ where: { id } });
    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }
    Object.assign(facility, data);
    const saved = await this.facilityRepository.save(facility);
    return saved as RecreationalFacilityDto;
  }

  async deleteFacility(id: number): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.findOne({ where: { id } });
    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }

    // Check if facility has active bookings
    const activeBookings = await this.bookingRepository.count({
      where: {
        facilityId: id,
        status: And(
          Not(RecreationalBookingStatus.COMPLETED),
          Not(RecreationalBookingStatus.CANCELLED),
          Not(RecreationalBookingStatus.NO_SHOW),
        ),
      },
    });

    if (activeBookings > 0) {
      throw new RpcException({
        statusCode: 400,
        message: `Cannot delete facility with ${activeBookings} active bookings`,
      });
    }

    await this.facilityRepository.remove(facility);
    return { ...facility, id } as RecreationalFacilityDto;
  }

  // Booking Management
  async createBooking(
    data: CreateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id: data.facilityId },
    });
    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${data.facilityId} not found`,
      });
    }

    // Parse bookingDate as Date object
    const bookingDate = new Date(data.bookingDate);

    // Validate facility availability
    this.validateFacilityAvailability(
      facility,
      bookingDate,
      data.startTime,
      data.endTime,
    );

    // Check for overlapping bookings
    await this.checkBookingConflicts(
      data.facilityId,
      bookingDate,
      data.startTime,
      data.endTime,
    );

    // Validate participants count
    if (data.participants > facility.capacity) {
      throw new RpcException({
        statusCode: 400,
        message: `Number of participants (${data.participants}) exceeds facility capacity (${facility.capacity})`,
      });
    }

    // Recreational facilities are free for guests
    const booking = this.bookingRepository.create({
      ...data,
      bookingDate,
      totalCost: 0,
      status: RecreationalBookingStatus.PENDING,
    });

    const saved = await this.bookingRepository.save(booking);

    // Send confirmation notification
    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'Recreational Booking Created',
        message: `New booking for ${facility.name} on ${bookingDate.toISOString().split('T')[0]} from ${data.startTime} to ${data.endTime}`,
        refId: saved.id,
        refType: 'recreational_booking',
      })
      .subscribe({
        error: (error) => {
          console.error(
            'Error creating recreational booking notification:',
            error,
          );
        },
      });

    return this.findOneBooking(saved.id);
  }

  async findAllBookings(): Promise<RecreationalBookingDto[]> {
    const bookings = await this.bookingRepository.find({
      relations: ['facility'],
      order: { bookingDate: 'DESC', startTime: 'ASC' },
    });
    return bookings as unknown as RecreationalBookingDto[];
  }

  async findOneBooking(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['facility'],
    });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }
    return booking as unknown as RecreationalBookingDto;
  }

  async findBookingsByDate(date: Date): Promise<RecreationalBookingDto[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.bookingRepository.find({
      where: {
        bookingDate: Between(startOfDay, endOfDay),
      },
      relations: ['facility'],
      order: { startTime: 'ASC' },
    });
    return bookings as unknown as RecreationalBookingDto[];
  }

  async findBookingsByFacility(
    facilityId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RecreationalBookingDto[]> {
    const where: {
      facilityId: number;
      bookingDate?: any;
    } = { facilityId };

    if (startDate && endDate) {
      where.bookingDate = Between(startDate, endDate);
    }

    const bookings = await this.bookingRepository.find({
      where,
      relations: ['facility'],
      order: { bookingDate: 'DESC', startTime: 'ASC' },
    });
    return bookings as unknown as RecreationalBookingDto[];
  }

  async updateBooking(
    id: number,
    data: UpdateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['facility'],
    });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }

    // If changing time/date, validate availability
    if (data.bookingDate || data.startTime || data.endTime || data.facilityId) {
      const facilityId = data.facilityId || booking.facilityId;
      const facility = await this.facilityRepository.findOne({
        where: { id: facilityId },
      });
      if (!facility) {
        throw new RpcException({
          statusCode: 404,
          message: `Recreational facility with ID ${facilityId} not found`,
        });
      }
      const bookingDate = data.bookingDate
        ? new Date(data.bookingDate)
        : booking.bookingDate;
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

    // Recreational facilities are free for guests
    booking.totalCost = 0;

    Object.assign(booking, data);
    const saved = await this.bookingRepository.save(booking);
    return saved as unknown as RecreationalBookingDto;
  }

  async cancelBooking(
    id: number,
    reason?: string,
  ): Promise<RecreationalBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['facility'],
    });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }

    if (booking.status === RecreationalBookingStatus.COMPLETED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Cannot cancel a completed booking',
      });
    }

    booking.status = RecreationalBookingStatus.CANCELLED;
    booking.staffNotes = reason ? `Cancelled: ${reason}` : 'Booking cancelled';

    const updated = await this.bookingRepository.save(booking);

    // Notify about cancellation
    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'Recreational Booking Cancelled',
        message: `Booking for ${updated.facility.name} on ${updated.bookingDate.toDateString()} has been cancelled`,
        refId: updated.id,
        refType: 'recreational_booking',
      })
      .subscribe({
        error: (error) => {
          console.error(
            'Error creating recreational booking cancellation notification:',
            error,
          );
        },
      });

    return updated as unknown as RecreationalBookingDto;
  }

  async checkInBooking(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['facility'],
    });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }

    if (booking.status !== RecreationalBookingStatus.CONFIRMED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Only confirmed bookings can be checked in',
      });
    }

    booking.status = RecreationalBookingStatus.CHECKED_IN;
    booking.actualCheckIn = new Date();

    const saved = await this.bookingRepository.save(booking);
    return saved as unknown as RecreationalBookingDto;
  }

  async checkOutBooking(id: number): Promise<RecreationalBookingDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['facility'],
    });
    if (!booking) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational booking with ID ${id} not found`,
      });
    }

    if (booking.status !== RecreationalBookingStatus.CHECKED_IN) {
      throw new RpcException({
        statusCode: 400,
        message: 'Only checked-in bookings can be checked out',
      });
    }

    booking.status = RecreationalBookingStatus.COMPLETED;
    booking.actualCheckOut = new Date();

    const saved = await this.bookingRepository.save(booking);
    return saved as unknown as RecreationalBookingDto;
  }

  // Availability Management
  async getFacilityAvailability(
    facilityId: number,
    date: Date,
  ): Promise<FacilityAvailabilityDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id: facilityId },
    });
    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${facilityId} not found`,
      });
    }

    // Check if facility is available on this day
    const dayOfWeek = date.getDay();
    const isAvailableDay =
      !facility.availableDays || facility.availableDays.includes(dayOfWeek);

    if (
      !isAvailableDay ||
      !facility.isAvailable ||
      facility.status !== FacilityStatus.AVAILABLE
    ) {
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        date: date.toISOString().split('T')[0],
        isAvailable: false,
        availableSlots: [],
        notes: 'Facility not available on this date',
      };
    }

    // Generate time slots
    const availableSlots = await this.generateAvailableTimeSlots(
      facility,
      date,
    );

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      date: date.toISOString().split('T')[0],
      isAvailable: availableSlots.some((slot) => slot.isAvailable),
      availableSlots,
      notes: facility.maintenanceNotes,
    };
  }

  async getMultipleFacilitiesAvailability(
    facilityIds: number[],
    date: Date,
  ): Promise<FacilityAvailabilityDto[]> {
    const availabilityPromises = facilityIds.map((id) =>
      this.getFacilityAvailability(id, date).catch(() => null),
    );

    const results = await Promise.all(availabilityPromises);
    return results.filter(Boolean) as FacilityAvailabilityDto[];
  }

  // Statistics and Reporting
  async getBookingStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<BookingStatisticsDto> {
    const bookings = await this.bookingRepository.find({
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

    // Status breakdown
    const statusBreakdown = bookings.reduce(
      (acc, booking) => {
        const status = booking.status || 'PENDING';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Most popular facility type
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

    // Peak booking hours
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

    // Facility stats
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
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    };
  }

  // Private helper methods
  private validateFacilityAvailability(
    facility: RecreationalFacility,
    date: Date,
    startTime: string,
    endTime: string,
  ): void {
    // Check if facility is generally available
    if (!facility.isAvailable || facility.status !== FacilityStatus.AVAILABLE) {
      throw new RpcException({
        statusCode: 400,
        message: 'Facility is not available for booking',
      });
    }

    // Check if booking is within operating hours
    if (startTime < facility.openingTime || endTime > facility.closingTime) {
      throw new RpcException({
        statusCode: 400,
        message: `Booking time must be within operating hours (${facility.openingTime} - ${facility.closingTime})`,
      });
    }

    // Calculate duration
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
    const whereConditions: Record<string, any> = {
      facilityId,
      bookingDate: date,
      status: And(
        Not(RecreationalBookingStatus.CANCELLED),
        Not(RecreationalBookingStatus.NO_SHOW),
      ),
    };

    if (excludeBookingId) {
      whereConditions.id = Not(excludeBookingId);
    }

    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(whereConditions)
      .andWhere(
        `(
          (booking.startTime <= :startTime AND booking.endTime > :startTime) OR
          (booking.startTime < :endTime AND booking.endTime >= :endTime) OR
          (booking.startTime >= :startTime AND booking.endTime <= :endTime)
        )`,
        { startTime, endTime },
      )
      .getMany();

    if (conflictingBookings.length > 0) {
      const facility = await this.facilityRepository.findOne({
        where: { id: facilityId },
      });
      // Get the next available time slot
      const availableSlots = await this.generateAvailableTimeSlots(
        facility!,
        date,
      );

      // Find the next available slot after the requested time
      const nextAvailable = availableSlots.find(
        (slot) => slot.isAvailable && slot.startTime > startTime,
      );

      throw new RpcException({
        statusCode: 409,
        message: nextAvailable
          ? `The ${startTime} time slot is not available because a booking already exists.\n\nYou can book at ${nextAvailable.startTime}, which is the next available time slot.`
          : 'Sorry, there are no available time slots for this day. Please try booking on another date.',
      });
    }
  }

  private async generateAvailableTimeSlots(
    facility: RecreationalFacility,
    date: Date,
  ): Promise<TimeSlotDto[]> {
    const slots: TimeSlotDto[] = [];
    const openingHour = parseInt(facility.openingTime.split(':')[0]);
    const openingMinute = parseInt(facility.openingTime.split(':')[1]);
    const closingHour = parseInt(facility.closingTime.split(':')[0]);

    // Get existing bookings for this date
    const existingBookings = await this.bookingRepository.find({
      where: {
        facilityId: facility.id,
        bookingDate: date,
        status: And(
          Not(RecreationalBookingStatus.CANCELLED),
          Not(RecreationalBookingStatus.NO_SHOW),
        ),
      },
    });

    // Generate hourly time slots
    for (let hour = openingHour; hour < closingHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:${openingMinute.toString().padStart(2, '0')}`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:${openingMinute.toString().padStart(2, '0')}`;

      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some((booking) => {
        return (
          (booking.startTime <= startTime && booking.endTime > startTime) ||
          (booking.startTime < endTime && booking.endTime >= endTime) ||
          (booking.startTime >= startTime && booking.endTime <= endTime)
        );
      });

      slots.push({
        startTime,
        endTime,
        isAvailable: !hasConflict,
        reason: hasConflict ? 'Already booked' : undefined,
      });
    }

    return slots;
  }

  private async getFacilityUsageStats(
    startDate: Date,
    endDate: Date,
  ): Promise<FacilityUsageStatsDto[]> {
    const facilities = await this.facilityRepository.find();
    const stats: FacilityUsageStatsDto[] = [];

    for (const facility of facilities) {
      const bookings = await this.bookingRepository.find({
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

      // Calculate utilization rate
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
    const openingHour = parseInt(facility.openingTime.split(':')[0]);
    const openingMinute = parseInt(facility.openingTime.split(':')[1]);
    const closingHour = parseInt(facility.closingTime.split(':')[0]);
    const closingMinute = parseInt(facility.closingTime.split(':')[1]);

    const openingTimeInMinutes = openingHour * 60 + openingMinute;
    const closingTimeInMinutes = closingHour * 60 + closingMinute;

    return (closingTimeInMinutes - openingTimeInMinutes) / 60;
  }
}

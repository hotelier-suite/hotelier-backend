import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, And, Not } from 'typeorm';
import { RecreationalFacility } from './entities';
import { RecreationalBooking } from '../bookings/entities';
import { NotificationsService } from '../notifications-service';
import { NotificationType } from '@app/contracts/notifications-service';
import {
  CreateRecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
  RecreationalFacilityDto,
  FacilityAvailabilityDto,
  TimeSlotDto,
  FacilityStatus,
  RecreationalBookingStatus,
  FindFacilitiesFilterDto,
} from '@app/contracts/recreational-service';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(RecreationalFacility)
    private readonly facilityRepository: Repository<RecreationalFacility>,
    @InjectRepository(RecreationalBooking)
    private readonly recreationalBookingRepository: Repository<RecreationalBooking>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private readonly facilitySelect: FindOptionsSelect<RecreationalFacility> = {
    id: true,
    name: true,
    type: true,
    status: true,
    capacity: true,
    area: true,
    location: true,
    description: true,
    hourlyRate: true,
    available: true,
    openingTime: true,
    closingTime: true,
    minimumBookingHours: true,
    maximumBookingHours: true,
    amenities: true,
    rules: true,
    advanceBookingHours: true,
    availableDays: true,
    maintenanceNotes: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(
    data: CreateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.save(data);

    this.notificationsService
      .create({
        type: NotificationType.INFO,
        title: 'New Recreational Facility Added',
        message: `New ${data.type.toLowerCase()} facility "${data.name}" has been added`,
        refId: facility.id,
        refType: 'recreational_facility',
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return facility;
  }

  findAll(
    filters: FindFacilitiesFilterDto,
  ): Promise<RecreationalFacilityDto[]> {
    return this.facilityRepository.find({
      where: filters,
      select: this.facilitySelect,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id },
      select: this.facilitySelect,
    });

    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }

    return facility;
  }

  async update(
    id: number,
    data: UpdateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    const existing = await this.facilityRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }

    const merged = this.facilityRepository.merge(existing, data);
    return this.facilityRepository.save(merged);
  }

  async remove(id: number): Promise<RecreationalFacilityDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id },
      select: this.facilitySelect,
    });

    if (!facility) {
      throw new RpcException({
        statusCode: 404,
        message: `Recreational facility with ID ${id} not found`,
      });
    }

    const activeBookings = await this.recreationalBookingRepository.count({
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
    return { ...facility, id };
  }

  async getAvailability(
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

    const dayOfWeek = date.getDay();
    const isAvailableDay =
      !facility.availableDays || facility.availableDays.includes(dayOfWeek);

    if (
      !isAvailableDay ||
      !facility.available ||
      facility.status !== FacilityStatus.AVAILABLE
    ) {
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        date,
        isAvailable: false,
        availableSlots: [],
        notes: 'Facility not available on this date',
      };
    }

    const availableSlots = await this.generateAvailableTimeSlots(
      facility,
      date,
    );

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      date,
      isAvailable: availableSlots.some((slot) => slot.isAvailable),
      availableSlots,
      notes: facility.maintenanceNotes,
    };
  }

  async getMultipleAvailability(
    facilityIds: number[],
    date: Date,
  ): Promise<FacilityAvailabilityDto[]> {
    const availabilityPromises = facilityIds.map((id) =>
      this.getAvailability(id, date).catch(() => null),
    );

    const results = await Promise.all(availabilityPromises);
    return results.filter(Boolean) as FacilityAvailabilityDto[];
  }

  private async generateAvailableTimeSlots(
    facility: RecreationalFacility,
    date: Date,
  ): Promise<TimeSlotDto[]> {
    const slots: TimeSlotDto[] = [];
    const [openingHours, openingMinutes] = facility.openingTime
      .split(':')
      .map(Number);
    const [closingHours] = facility.closingTime.split(':').map(Number);

    const existingBookings = await this.recreationalBookingRepository.find({
      where: {
        facilityId: facility.id,
        bookingDate: date,
        status: And(
          Not(RecreationalBookingStatus.CANCELLED),
          Not(RecreationalBookingStatus.NO_SHOW),
        ),
      },
    });

    for (let hour = openingHours; hour < closingHours; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:${openingMinutes.toString().padStart(2, '0')}`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:${openingMinutes.toString().padStart(2, '0')}`;

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
}

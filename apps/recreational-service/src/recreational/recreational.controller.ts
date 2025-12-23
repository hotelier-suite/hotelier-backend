import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecreationalService } from './recreational.service';
import { RECREATIONAL_FACILITIES_PATTERNS } from '@app/contracts/recreational-service/facilities/facilities.patterns';
import { RECREATIONAL_BOOKINGS_PATTERNS } from '@app/contracts/recreational-service/bookings/bookings.patterns';
import {
  RecreationalFacilityDto,
  CreateRecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
  FacilityAvailabilityDto,
} from '@app/contracts/recreational-service/facilities/dto';
import { FacilityType } from '@app/contracts/recreational-service/facilities/enums';
import {
  RecreationalBookingDto,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  BookingStatisticsDto,
} from '@app/contracts/recreational-service/bookings/dto';

@Controller()
export class RecreationalController {
  constructor(private readonly recreationalService: RecreationalService) {}

  // Facility patterns
  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_ALL)
  findAllFacilities(): Promise<RecreationalFacilityDto[]> {
    return this.recreationalService.findAllFacilities();
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_ONE)
  findOneFacility(@Payload() id: number): Promise<RecreationalFacilityDto> {
    return this.recreationalService.findOneFacility(id);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.CREATE)
  createFacility(
    @Payload() data: CreateRecreationalFacilityDto,
  ): Promise<RecreationalFacilityDto> {
    return this.recreationalService.createFacility(data);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.UPDATE)
  updateFacility(
    @Payload() payload: { id: number; data: UpdateRecreationalFacilityDto },
  ): Promise<RecreationalFacilityDto> {
    return this.recreationalService.updateFacility(payload.id, payload.data);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.DELETE)
  deleteFacility(@Payload() id: number): Promise<RecreationalFacilityDto> {
    return this.recreationalService.deleteFacility(id);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_AVAILABLE)
  findAvailableFacilities(): Promise<RecreationalFacilityDto[]> {
    return this.recreationalService.findAvailableFacilities();
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.FIND_BY_TYPE)
  findFacilitiesByType(
    @Payload() type: FacilityType,
  ): Promise<RecreationalFacilityDto[]> {
    return this.recreationalService.findFacilitiesByType(type);
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.GET_AVAILABILITY)
  getFacilityAvailability(
    @Payload() payload: { facilityId: number; date: string },
  ): Promise<FacilityAvailabilityDto> {
    return this.recreationalService.getFacilityAvailability(
      payload.facilityId,
      new Date(payload.date),
    );
  }

  @MessagePattern(RECREATIONAL_FACILITIES_PATTERNS.GET_MULTIPLE_AVAILABILITY)
  getMultipleFacilitiesAvailability(
    @Payload() payload: { facilityIds: number[]; date: string },
  ): Promise<FacilityAvailabilityDto[]> {
    return this.recreationalService.getMultipleFacilitiesAvailability(
      payload.facilityIds,
      new Date(payload.date),
    );
  }

  // Booking patterns
  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_ALL)
  findAllBookings(): Promise<RecreationalBookingDto[]> {
    return this.recreationalService.findAllBookings();
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_ONE)
  findOneBooking(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.recreationalService.findOneBooking(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CREATE)
  createBooking(
    @Payload() data: CreateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    return this.recreationalService.createBooking(data);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.UPDATE)
  updateBooking(
    @Payload() payload: { id: number; data: UpdateRecreationalBookingDto },
  ): Promise<RecreationalBookingDto> {
    return this.recreationalService.updateBooking(payload.id, payload.data);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.DELETE)
  deleteBooking(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.recreationalService.findOneBooking(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CANCEL)
  cancelBooking(
    @Payload() payload: { id: number; reason?: string },
  ): Promise<RecreationalBookingDto> {
    return this.recreationalService.cancelBooking(payload.id, payload.reason);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CHECK_IN)
  checkInBooking(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.recreationalService.checkInBooking(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CHECK_OUT)
  checkOutBooking(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.recreationalService.checkOutBooking(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_DATE)
  findBookingsByDate(
    @Payload() date: string,
  ): Promise<RecreationalBookingDto[]> {
    return this.recreationalService.findBookingsByDate(new Date(date));
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_FACILITY)
  findBookingsByFacility(
    @Payload()
    payload: {
      facilityId: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<RecreationalBookingDto[]> {
    return this.recreationalService.findBookingsByFacility(
      payload.facilityId,
      payload.startDate ? new Date(payload.startDate) : undefined,
      payload.endDate ? new Date(payload.endDate) : undefined,
    );
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.GET_STATISTICS)
  getBookingStatistics(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<BookingStatisticsDto> {
    return this.recreationalService.getBookingStatistics(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import {
  RECREATIONAL_BOOKINGS_PATTERNS,
  RecreationalBookingDto,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  BookingStatisticsDto,
} from '@app/contracts/recreational-service';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_ALL)
  findAll(): Promise<RecreationalBookingDto[]> {
    return this.bookingsService.findAll();
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.bookingsService.findOne(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateRecreationalBookingDto,
  ): Promise<RecreationalBookingDto> {
    return this.bookingsService.create(data);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateRecreationalBookingDto },
  ): Promise<RecreationalBookingDto> {
    return this.bookingsService.update(payload.id, payload.data);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.bookingsService.remove(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CANCEL)
  cancel(
    @Payload() payload: { id: number; reason?: string },
  ): Promise<RecreationalBookingDto> {
    return this.bookingsService.cancel(payload.id, payload.reason);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CHECK_IN)
  checkIn(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.bookingsService.checkIn(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.CHECK_OUT)
  checkOut(@Payload() id: number): Promise<RecreationalBookingDto> {
    return this.bookingsService.checkOut(id);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_DATE)
  findByDate(@Payload() date: Date): Promise<RecreationalBookingDto[]> {
    return this.bookingsService.findByDate(date);
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_FACILITY)
  findByFacility(
    @Payload()
    payload: {
      facilityId: number;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<RecreationalBookingDto[]> {
    return this.bookingsService.findByFacility(
      payload.facilityId,
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(RECREATIONAL_BOOKINGS_PATTERNS.GET_STATISTICS)
  getStatistics(
    @Payload() payload: { startDate: Date; endDate: Date },
  ): Promise<BookingStatisticsDto> {
    return this.bookingsService.getStatistics(
      payload.startDate,
      payload.endDate,
    );
  }
}

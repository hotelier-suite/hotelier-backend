import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReservationsService } from './reservations.service';
import {
  RESERVATIONS_PATTERNS,
  ReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
  GetAvailabilityDto,
  CheckoutReservationResponseDto,
  RoomDto,
  FindReservationsFilterDto,
} from '@app/contracts/booking-service';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: FindReservationsFilterDto,
  ): Promise<ReservationDto[]> {
    return this.reservationsService.findAll(filters);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<ReservationDto> {
    return this.reservationsService.findOne(id);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.GET_AVAILABILITY)
  getAvailability(@Payload() query: GetAvailabilityDto): Promise<RoomDto[]> {
    return this.reservationsService.getAvailability(query);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.CREATE)
  create(@Payload() data: CreateReservationDto): Promise<ReservationDto> {
    return this.reservationsService.create(data);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateReservationDto },
  ): Promise<ReservationDto> {
    return this.reservationsService.update(payload.id, payload.data);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<ReservationDto> {
    return this.reservationsService.remove(id);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.CHECKOUT)
  checkout(@Payload() id: number): Promise<CheckoutReservationResponseDto> {
    return this.reservationsService.checkout(id);
  }
}

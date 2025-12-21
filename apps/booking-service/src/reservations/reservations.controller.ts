import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RESERVATIONS_PATTERNS } from '@app/contracts/booking-service/reservations/reservations.patterns';
import { ReservationDto } from '@app/contracts/booking-service/reservations/dto/reservation.dto';
import { CreateReservationDto } from '@app/contracts/booking-service/reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from '@app/contracts/booking-service/reservations/dto/update-reservation.dto';
import { GetAvailabilityDto } from '@app/contracts/booking-service/reservations/dto/get-availability.dto';
import { CheckoutReservationResponseDto } from '@app/contracts/booking-service/reservations/dto/checkout-reservation-response.dto';
import { RoomDto } from '@app/contracts/booking-service/rooms/dto/room.dto';
import { ReservationsService } from './reservations.service';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_ALL)
  findAll(): Promise<ReservationDto[]> {
    return this.reservationsService.findAll();
  }

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<ReservationDto> {
    return this.reservationsService.findOne(id);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_MINE)
  findMine(@Payload() userId: number): Promise<ReservationDto[]> {
    return this.reservationsService.findMine(userId);
  }

  @MessagePattern(RESERVATIONS_PATTERNS.FIND_CURRENT)
  findCurrent(): Promise<ReservationDto[]> {
    return this.reservationsService.findCurrent();
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

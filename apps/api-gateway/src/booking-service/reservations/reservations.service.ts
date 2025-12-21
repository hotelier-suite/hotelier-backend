import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { BOOKING_SERVICE_CLIENT } from '../constants';
import { RESERVATIONS_PATTERNS } from '@app/contracts/booking-service/reservations/reservations.patterns';
import { ReservationDto } from '@app/contracts/booking-service/reservations/dto/reservation.dto';
import { CreateReservationDto } from '@app/contracts/booking-service/reservations/dto/create-reservation.dto';
import { UpdateReservationDto } from '@app/contracts/booking-service/reservations/dto/update-reservation.dto';
import { GetAvailabilityDto } from '@app/contracts/booking-service/reservations/dto/get-availability.dto';
import { CheckoutReservationResponseDto } from '@app/contracts/booking-service/reservations/dto/checkout-reservation-response.dto';
import { RoomDto } from '@app/contracts/booking-service/rooms/dto/room.dto';
import { ReservationStatus } from '@app/contracts/booking-service/reservations/enums/reservation-status.enum';
import { Invoice } from '../../billing/entities/invoice.entity';
import { InvoiceStatus } from '../../billing/enums/invoice-status.enum';
import { RoomServiceOrder } from '../../restaurant/entities/room-service-order.entity';
import { EventBooking } from '../../events/entities/event-booking.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(BOOKING_SERVICE_CLIENT)
    private readonly bookingClient: ClientProxy,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(RoomServiceOrder)
    private readonly roomServiceOrderRepository: Repository<RoomServiceOrder>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Observable<ReservationDto[]> {
    return this.bookingClient.send<ReservationDto[], Record<string, never>>(
      RESERVATIONS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<ReservationDto> {
    return this.bookingClient.send<ReservationDto, number>(
      RESERVATIONS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findMine(userId: number): Observable<ReservationDto[]> {
    return this.bookingClient.send<ReservationDto[], number>(
      RESERVATIONS_PATTERNS.FIND_MINE,
      userId,
    );
  }

  findCurrent(): Observable<ReservationDto[]> {
    return this.bookingClient.send<ReservationDto[], Record<string, never>>(
      RESERVATIONS_PATTERNS.FIND_CURRENT,
      {},
    );
  }

  getAvailability(query: GetAvailabilityDto): Observable<RoomDto[]> {
    return this.bookingClient.send<RoomDto[], GetAvailabilityDto>(
      RESERVATIONS_PATTERNS.GET_AVAILABILITY,
      query,
    );
  }

  create(data: CreateReservationDto): Observable<ReservationDto> {
    return this.bookingClient.send<ReservationDto, CreateReservationDto>(
      RESERVATIONS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateReservationDto): Observable<ReservationDto> {
    return this.bookingClient.send<
      ReservationDto,
      { id: number; data: UpdateReservationDto }
    >(RESERVATIONS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<ReservationDto> {
    return this.bookingClient.send<ReservationDto, number>(
      RESERVATIONS_PATTERNS.DELETE,
      id,
    );
  }

  checkout(id: number): Observable<CheckoutReservationResponseDto> {
    return this.bookingClient.send<CheckoutReservationResponseDto, number>(
      RESERVATIONS_PATTERNS.CHECKOUT,
      id,
    );
  }

  async getReservationsWithBillingDetails(): Promise<any[]> {
    const reservations = await lastValueFrom(this.findAll());

    const relevant: ReservationDto[] = reservations.filter((r) =>
      [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN,
        ReservationStatus.CHECKED_OUT,
      ].includes(r.status),
    );

    const billingDetails = await Promise.all(
      relevant.map(async (reservation) => {
        const roomCharges = Number(reservation.totalAmount) || 0;

        const roomNumber = reservation.room?.number;

        const roomServiceOrders = await this.roomServiceOrderRepository.find({
          where: reservation.guestId
            ? { guestId: reservation.guestId }
            : roomNumber
              ? { room: roomNumber }
              : undefined,
        });

        const roomServiceCharges = roomServiceOrders.map((order) => ({
          orderId: order.id,
          orderNumber: order.orderNumber,
          orderTime: order.orderTime,
          total: Number(order.total),
          status: order.status,
          items: order.items,
        }));

        const roomServiceTotal = roomServiceOrders.reduce(
          (sum, order) => sum + Number(order.total),
          0,
        );

        const eventBookings: EventBooking[] = reservation.guestId
          ? await this.dataSource.getRepository(EventBooking).find({
              where: { guestId: reservation.guestId },
            })
          : [];

        const eventCharges = eventBookings.map((event) => ({
          bookingId: event.id,
          title: event.title,
          eventDate: event.eventDate,
          total: Number(event.totalCost),
          status: event.status,
          attendees: event.attendees,
        }));

        const eventTotal = eventBookings.reduce(
          (sum, event) => sum + Number(event.totalCost),
          0,
        );

        const existingInvoice = await this.invoiceRepository.findOne({
          where: {
            reservationId: reservation.id,
            status: InvoiceStatus.PAID,
          },
        });

        const grandTotal = roomCharges + roomServiceTotal + eventTotal;
        const isPendingPayment = !existingInvoice && grandTotal > 0;

        return {
          reservation,
          roomCharges,
          roomServiceCharges,
          roomServiceTotal,
          eventCharges,
          eventTotal,
          grandTotal,
          hasInvoice: !!existingInvoice,
          isPendingPayment,
          reservationStatus: reservation.status,
        };
      }),
    );

    return billingDetails;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BOOKING_SERVICE_CLIENT } from '../constants';
import { BILLING_SERVICE_CLIENT } from '../../billing-service';
import { RESTAURANT_SERVICE_CLIENT } from '../../restaurant-service';
import { EVENTS_SERVICE_CLIENT } from '../../events-service';
import {
  RESERVATIONS_PATTERNS,
  ReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
  GetAvailabilityDto,
  CheckoutReservationResponseDto,
  ReservationStatus,
  RoomDto,
  FindReservationsFilterDto,
} from '@app/contracts/booking-service';
import {
  INVOICES_PATTERNS,
  InvoiceDto,
  InvoiceStatus,
} from '@app/contracts/billing-service';
import {
  ROOM_SERVICE_ORDERS_PATTERNS,
  RoomServiceOrderDto,
} from '@app/contracts/restaurant-service';
import {
  EVENT_BOOKINGS_PATTERNS,
  EventBookingDto,
} from '@app/contracts/events-service';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(BOOKING_SERVICE_CLIENT)
    private readonly bookingClient: ClientProxy,
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
    @Inject(RESTAURANT_SERVICE_CLIENT)
    private readonly restaurantClient: ClientProxy,
    @Inject(EVENTS_SERVICE_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  findAll(filters: FindReservationsFilterDto): Observable<ReservationDto[]> {
    return this.bookingClient.send<ReservationDto[], FindReservationsFilterDto>(
      RESERVATIONS_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<ReservationDto> {
    return this.bookingClient.send<ReservationDto, number>(
      RESERVATIONS_PATTERNS.FIND_ONE,
      id,
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
    const reservations = await lastValueFrom(this.findAll({}));

    const relevant: ReservationDto[] = reservations.filter((r) =>
      [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN,
        ReservationStatus.CHECKED_OUT,
      ].includes(r.status),
    );

    const allInvoices: InvoiceDto[] = await lastValueFrom(
      this.billingClient
        .send<
          InvoiceDto[],
          Record<string, never>
        >(INVOICES_PATTERNS.FIND_ALL, {})
        .pipe(catchError(() => of([] as InvoiceDto[]))),
    );

    const allRoomServiceOrders: RoomServiceOrderDto[] = await lastValueFrom(
      this.restaurantClient
        .send<
          RoomServiceOrderDto[],
          Record<string, never>
        >(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ALL, {})
        .pipe(catchError(() => of([] as RoomServiceOrderDto[]))),
    );

    const allEventBookings: EventBookingDto[] = await lastValueFrom(
      this.eventsClient
        .send<
          EventBookingDto[],
          Record<string, never>
        >(EVENT_BOOKINGS_PATTERNS.FIND_ALL, {})
        .pipe(catchError(() => of([] as EventBookingDto[]))),
    );

    const billingDetails = relevant.map((reservation) => {
      const roomCharges = Number(reservation.totalAmount) || 0;
      const roomNumber = reservation.room?.number;

      const roomServiceOrders = allRoomServiceOrders.filter(
        (order) =>
          (reservation.guestId && order.guestId === reservation.guestId) ||
          (roomNumber && order.room === roomNumber),
      );

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

      const eventBookings = reservation.guestId
        ? allEventBookings.filter(
            (event) => event.guestId === reservation.guestId,
          )
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

      const existingInvoice = allInvoices.find(
        (invoice) =>
          invoice.reservationId === reservation.id &&
          invoice.status === InvoiceStatus.PAID,
      );

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
    });

    return billingDetails;
  }
}

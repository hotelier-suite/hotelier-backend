import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThan,
  MoreThan,
  In,
  DataSource,
} from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Room } from '../rooms/entities/room.entity';
import { HousekeepingService } from '../housekeeping/housekeeping.service';
import { NotificationsService } from '../notifications-service/notifications/notifications.service';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './enums/reservation-status.enum';
import { OccupancyStatsInterface } from './interfaces/occupancy-stats.interface';
import { UpcomingReservationInterface } from './interfaces/upcoming-reservation.interface';
import { CreateCleaningAssignmentDto } from '../housekeeping/dto/create-cleaning-assignment.dto';
import { CheckoutReservationResponseDto } from './dto/checkout-reservation-response.dto';
import { Invoice } from '../billing/entities/invoice.entity';
import { InvoiceItem } from '../billing/entities/invoice-item.entity';
import { InvoiceStatus } from '../billing/enums/invoice-status.enum';
import { RoomServiceOrder } from '../restaurant/entities/room-service-order.entity';
import { RoomType } from '../rooms/enums/room-type.enum';
import { EventBooking } from '../events/entities/event-booking.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(RoomServiceOrder)
    private readonly roomServiceOrderRepository: Repository<RoomServiceOrder>,
    private readonly housekeepingService: HousekeepingService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async getCurrentGuests(): Promise<Reservation[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.reservationRepository.find({
      where: {
        status: ReservationStatus.CHECKED_IN,
        checkOutDate: MoreThanOrEqual(today),
      },
      relations: ['room', 'guest'],
      order: {
        checkOutDate: 'ASC',
      },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: { guest: true, room: true },
      order: { createdAt: 'DESC' },
    });
  }

  // Availability search for UR-001
  async getAvailability(
    startDate: string,
    endDate: string,
    type?: RoomType,
    minGuests?: number,
  ): Promise<Room[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw new BadRequestException('Invalid date range');
    }

    const blockingStatuses: ReservationStatus[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
    ];

    const qb = this.roomRepository.createQueryBuilder('room');
    qb.leftJoin(
      Reservation,
      'res',
      'res.roomId = room.id AND res.checkInDate < :end AND res.checkOutDate > :start AND res.status IN (:...statuses)',
      { start, end, statuses: blockingStatuses },
    );
    qb.where('res.id IS NULL');

    if (type) {
      qb.andWhere('room.type = :type', { type });
    }
    if (typeof minGuests === 'number') {
      qb.andWhere('room.capacity >= :minGuests', { minGuests });
    }

    qb.orderBy('room.number', 'ASC');
    return qb.getMany();
  }

  async findMine(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { userId },
      relations: { guest: true, room: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: { guest: true, room: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async create(data: CreateReservationDto): Promise<Reservation> {
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate base total from room price
    const room = await this.roomRepository.findOne({
      where: { id: data.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${data.roomId} not found`);
    }
    // Capacity validation
    if (typeof data.guests === 'number' && data.guests > room.capacity) {
      throw new BadRequestException(
        `Selected room capacity (${room.capacity}) is less than requested guests (${data.guests})`,
      );
    }
    // Overbooking validation: check for overlapping reservations with blocking statuses
    const blockingStatuses: ReservationStatus[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
    ];
    const overlapCount = await this.reservationRepository.count({
      where: {
        roomId: data.roomId,
        status: In(blockingStatuses),
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
      },
    });
    if (overlapCount > 0) {
      throw new BadRequestException(
        'Room is not available for the selected date range',
      );
    }

    let baseTotal = Number(room.price) * nights;
    // Apply discounts if provided
    if (data.discountPercent && Number(data.discountPercent) > 0) {
      baseTotal = baseTotal - baseTotal * (Number(data.discountPercent) / 100);
    }
    if (data.discountAmount && Number(data.discountAmount) > 0) {
      baseTotal = baseTotal - Number(data.discountAmount);
    }
    if (baseTotal < 0) baseTotal = 0;

    const created = await this.reservationRepository.save({
      ...data,
      checkInDate,
      checkOutDate,
      nights,
      totalAmount: baseTotal,
      status: ReservationStatus.PENDING,
    });
    // Notify system of new reservation
    this.notificationsService
      .createSystemAlert(
        'New reservation',
        `Reservation #${created.id} created for room ${room.number} (${nights} night${nights !== 1 ? 's' : ''})`,
        created.id,
        'RESERVATION',
      )
      .subscribe({
        error: (e) => {
          console.warn('Notification failed for reservation creation:', e);
        },
      });

    return created;
  }

  async update(id: number, data: UpdateReservationDto): Promise<Reservation> {
    const existingReservation = await this.findOne(id);
    const updatedData = { ...existingReservation, ...data };

    // Convert string dates to Date objects if provided
    if (data.checkInDate) {
      updatedData.checkInDate = new Date(data.checkInDate);
    }
    if (data.checkOutDate) {
      updatedData.checkOutDate = new Date(data.checkOutDate);
    }

    // Recalculate nights if dates are provided
    if (data.checkInDate || data.checkOutDate) {
      const checkInDate = updatedData.checkInDate as Date;
      const checkOutDate = updatedData.checkOutDate as Date;
      updatedData.nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
    }

    // Recalculate totalAmount if room or dates or discount changed
    if (
      data.roomId ||
      data.checkInDate ||
      data.checkOutDate ||
      typeof data.discountAmount !== 'undefined' ||
      typeof data.discountPercent !== 'undefined'
    ) {
      const roomId = data.roomId ?? existingReservation.roomId;
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found`);
      }
      // Capacity validation (if guests changed)
      const guests =
        typeof data.guests === 'number'
          ? data.guests
          : existingReservation.guests;
      if (typeof guests === 'number' && guests > room.capacity) {
        throw new BadRequestException(
          `Selected room capacity (${room.capacity}) is less than requested guests (${guests})`,
        );
      }
      const nights = updatedData.nights;
      let newTotal = Number(room.price) * nights;
      const discountPercent =
        typeof data.discountPercent !== 'undefined'
          ? Number(data.discountPercent)
          : (existingReservation.discountPercent ?? 0);
      const discountAmount =
        typeof data.discountAmount !== 'undefined'
          ? Number(data.discountAmount)
          : (existingReservation.discountAmount ?? 0);
      if (discountPercent && discountPercent > 0) {
        newTotal = newTotal - newTotal * (discountPercent / 100);
      }
      if (discountAmount && discountAmount > 0) {
        newTotal = newTotal - discountAmount;
      }
      if (newTotal < 0) newTotal = 0;
      (updatedData as Reservation).totalAmount = newTotal;
    }

    // Overbooking validation on updates that affect schedule or room
    if (data.roomId || data.checkInDate || data.checkOutDate) {
      const checkInDate =
        (updatedData.checkInDate as Date) ?? existingReservation.checkInDate;
      const checkOutDate =
        (updatedData.checkOutDate as Date) ?? existingReservation.checkOutDate;
      const roomId = data.roomId ?? existingReservation.roomId;
      const blockingStatuses: ReservationStatus[] = [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN,
      ];
      const conflict = await this.reservationRepository
        .createQueryBuilder('res')
        .where('res.roomId = :roomId', { roomId })
        .andWhere('res.id != :id', { id })
        .andWhere('res.status IN (:...statuses)', {
          statuses: blockingStatuses,
        })
        .andWhere(
          'res.checkInDate < :endDate AND res.checkOutDate > :startDate',
          {
            startDate: checkInDate,
            endDate: checkOutDate,
          },
        )
        .getCount();
      if (conflict > 0) {
        throw new BadRequestException(
          'Room is not available for the selected date range',
        );
      }
    }

    // Handle room availability on status transitions
    if (typeof data.status !== 'undefined' && existingReservation.roomId) {
      if (
        data.status === ReservationStatus.CONFIRMED ||
        data.status === ReservationStatus.CHECKED_IN
      ) {
        await this.roomRepository.update(existingReservation.roomId, {
          isAvailable: false,
        });
      } else if (data.status === ReservationStatus.CANCELLED) {
        await this.roomRepository.update(existingReservation.roomId, {
          isAvailable: true,
        });
      }
    }

    return this.reservationRepository.save(updatedData as Reservation);
  }

  async checkoutReservation(
    id: number,
  ): Promise<CheckoutReservationResponseDto> {
    const reservation = await this.findOne(id);

    // If already checked out, return as-is
    if (reservation.status === ReservationStatus.CHECKED_OUT) {
      return { reservation };
    }

    // Mark reservation as checked out
    await this.reservationRepository.update(id, {
      status: ReservationStatus.CHECKED_OUT,
    });

    // Block the room for cleaning (unavailable until cleaning completes)
    if (reservation.roomId) {
      await this.roomRepository.update(reservation.roomId, {
        isAvailable: false,
      });
    }

    // Enqueue a cleaning assignment (auto-assigned if env configured)
    let assignmentId: number | undefined;
    if (reservation.roomId) {
      const defaultEmp = process.env.DEFAULT_HOUSEKEEPING_EMPLOYEE_ID
        ? parseInt(process.env.DEFAULT_HOUSEKEEPING_EMPLOYEE_ID, 10)
        : undefined;

      const cleaningDto: Partial<CreateCleaningAssignmentDto> = {
        roomId: reservation.roomId,
        notes: `Cleaning after checkout of reservation ${reservation.id}`,
        employeeId: defaultEmp,
      };
      const created = await this.housekeepingService.createCleaningAssignment(
        cleaningDto as CreateCleaningAssignmentDto,
      );
      assignmentId = created.id;
    }

    // Notify system about checkout and cleaning queued
    this.notificationsService
      .createSystemAlert(
        'Checkout completed',
        `Reservation #${reservation.id} - Room ${reservation.room?.number ?? reservation.roomId} sent to cleaning`,
        reservation.id,
        'RESERVATION',
      )
      .subscribe({
        error: (error) => {
          console.warn('Notification failed for reservation checkout:', error);
        },
      });

    // Generate invoice if not exists
    let invoiceId: number | undefined;
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { reservationId: reservation.id },
    });
    if (!existingInvoice) {
      // Aggregate room charges
      const roomEntity =
        reservation.room ??
        (await this.roomRepository.findOne({
          where: { id: reservation.roomId },
        }))!;
      const nights = reservation.nights;
      const roomSubtotal = Number(roomEntity.price) * nights;

      // Aggregate restaurant orders between check-in and check-out for the same room number
      const roomNumber = roomEntity.number;
      const orders = await this.roomServiceOrderRepository
        .createQueryBuilder('order')
        .where('order.room = :room', { room: roomNumber })
        .andWhere('order.createdAt BETWEEN :start AND :end', {
          start: reservation.checkInDate,
          end: reservation.checkOutDate,
        })
        .getMany();
      const restaurantTotal = orders.reduce(
        (sum, o) => sum + Number(o.total),
        0,
      );

      const subtotal = roomSubtotal + restaurantTotal;
      const taxes = 0; // Future: derive from configuration
      const total = subtotal + taxes;

      const invoice = await this.invoiceRepository.save({
        number: `INV-${Date.now()}-${reservation.id}`,
        guestName: reservation.guestName,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subtotal,
        taxes,
        total,
        reservationId: reservation.id,
        userId: reservation.userId,
      });
      invoiceId = invoice.id;

      // Items: one for stay, one aggregated for restaurant (if any)
      await this.invoiceItemRepository.save({
        description: `Accommodation (${nights} night${nights !== 1 ? 's' : ''}) - Room ${roomNumber}`,
        quantity: nights,
        price: Number(roomEntity.price),
        total: roomSubtotal,
        invoiceId: invoice.id,
      });
      if (restaurantTotal > 0) {
        await this.invoiceItemRepository.save({
          description: 'Restaurant charges (room service)',
          quantity: 1,
          price: restaurantTotal,
          total: restaurantTotal,
          invoiceId: invoice.id,
        });
      }
    } else {
      invoiceId = existingInvoice.id;
    }

    // Return fresh copy with relations and assignment id
    return { reservation: await this.findOne(id), assignmentId, invoiceId };
  }

  async remove(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
    return reservation;
  }

  async getUpcomingReservations(): Promise<UpcomingReservationInterface[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations = await this.reservationRepository.find({
      where: {
        checkInDate: MoreThanOrEqual(today),
      },
      relations: { guest: true, room: true },
      order: { checkInDate: 'ASC' },
    });

    return reservations.map((reservation) => ({
      id: reservation.id,
      room: reservation.room?.number || 'N/A',
      guestName: reservation.guestName,
      roomType: reservation.room?.type || 'N/A',
      checkIn: reservation.checkInDate.toISOString().split('T')[0],
      checkOut: reservation.checkOutDate?.toISOString().split('T')[0] || 'N/A',
      totalGuests: reservation.guests,
    }));
  }

  async getOccupancyStats(
    startDate: Date,
    endDate: Date,
  ): Promise<OccupancyStatsInterface> {
    const totalReservations = await this.reservationRepository.count({
      where: {
        checkInDate: Between(startDate, endDate),
      },
    });

    const confirmedStatus = ReservationStatus.CONFIRMED;
    const confirmedReservations = await this.reservationRepository.count({
      where: {
        checkInDate: Between(startDate, endDate),
        status: confirmedStatus,
      },
    });

    const cancelledStatus = ReservationStatus.CANCELLED;
    const cancelledReservations = await this.reservationRepository.count({
      where: {
        checkInDate: Between(startDate, endDate),
        status: cancelledStatus,
      },
    });

    const occupancyRate =
      totalReservations > 0
        ? (confirmedReservations / totalReservations) * 100
        : 0;

    return {
      totalReservations,
      confirmedReservations,
      cancelledReservations,
      occupancyRate,
    };
  }

  async getReservationsWithBillingDetails(): Promise<any[]> {
    // Get ALL reservations except cancelled ones
    // This includes: PENDING, CONFIRMED, CHECKED_IN, and even CHECKED_OUT if no invoice
    const reservations = await this.reservationRepository.find({
      where: [
        { status: ReservationStatus.PENDING },
        { status: ReservationStatus.CONFIRMED },
        { status: ReservationStatus.CHECKED_IN },
        { status: ReservationStatus.CHECKED_OUT },
      ],
      relations: ['guest', 'room', 'user'],
      order: { checkInDate: 'DESC' },
    });

    const billingDetails = await Promise.all(
      reservations.map(async (reservation) => {
        // Calculate room charges
        const roomCharges = Number(reservation.totalAmount) || 0;

        // Get room service orders for this guest
        const roomServiceOrders = await this.roomServiceOrderRepository.find({
          where: reservation.guestId
            ? { guestId: reservation.guestId }
            : { room: reservation.room.number },
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

        // Get event bookings for this guest
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

        // Check if there's already a PAID invoice for this reservation
        const existingInvoice = await this.invoiceRepository.findOne({
          where: {
            reservationId: reservation.id,
            // Only consider it "has invoice" if it's paid (using correct enum value)
            status: InvoiceStatus.PAID,
          },
        });

        const grandTotal = roomCharges + roomServiceTotal + eventTotal;

        // Calculate if payment is pending
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
          isPendingPayment, // New field to indicate payment is needed
          reservationStatus: reservation.status, // Include status for filtering
        };
      }),
    );

    // Return all reservations, frontend will filter as needed
    return billingDetails;
  }
}

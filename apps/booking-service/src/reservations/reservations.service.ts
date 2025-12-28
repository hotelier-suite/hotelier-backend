import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import {
  ReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
  GetAvailabilityDto,
  CheckoutReservationResponseDto,
  ReservationStatus,
  BookingChannel,
  RoomDto,
  FindReservationsFilterDto,
} from '@app/contracts/booking-service';
import { NotificationType } from '@app/contracts/notifications-service';
import { Reservation } from './entities';
import { Room } from '../rooms';
import { Guest } from '../guests';
import { NotificationsService } from '../notifications-service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Guest)
    private readonly guestsRepository: Repository<Guest>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private readonly reservationRelations: FindOptionsRelations<Reservation> = {
    guest: true,
    room: true,
  };

  findAll(filters: FindReservationsFilterDto): Promise<ReservationDto[]> {
    const where: FindOptionsWhere<Reservation> = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.isCurrent) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.status = ReservationStatus.CHECKED_IN;
      where.checkOutDate = MoreThanOrEqual(today);
    }

    if (filters.startDate && filters.endDate) {
      where.checkInDate = Between(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
      where.checkInDate = MoreThanOrEqual(filters.startDate);
    } else if (filters.endDate) {
      where.checkInDate = LessThanOrEqual(filters.endDate);
    }

    // Use different ordering for current reservations
    const order = filters.isCurrent
      ? { checkOutDate: 'ASC' as const }
      : { createdAt: 'DESC' as const };

    return this.reservationsRepository.find({
      where,
      relations: this.reservationRelations,
      order,
    });
  }

  async findOne(id: number): Promise<ReservationDto> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: this.reservationRelations,
    });

    if (!reservation) {
      throw new RpcException({
        statusCode: 404,
        message: `Reservation with id ${id} not found`,
      });
    }

    return reservation;
  }

  async getAvailability({
    startDate,
    endDate,
    type,
    guests,
  }: GetAvailabilityDto): Promise<RoomDto[]> {
    if (startDate >= endDate) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid date range',
      });
    }

    const blockingStatuses: ReservationStatus[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
    ];

    const qb = this.roomsRepository.createQueryBuilder('room');
    qb.leftJoin(
      Reservation,
      'res',
      'res.roomId = room.id AND res.checkInDate < :endDate AND res.checkOutDate > :startDate AND res.status IN (:...statuses)',
      { startDate, endDate, statuses: blockingStatuses },
    );
    qb.where('res.id IS NULL');

    if (type) {
      qb.andWhere('room.type = :type', { type });
    }

    if (typeof guests === 'number') {
      qb.andWhere('room.capacity >= :minGuests', { minGuests: guests });
    }

    qb.orderBy('room.number', 'ASC');

    return qb.getMany();
  }

  async create(data: CreateReservationDto): Promise<ReservationDto> {
    const checkInDate = data.checkInDate;
    const checkOutDate = data.checkOutDate;

    const nights = this.calculateNights(checkInDate, checkOutDate);

    if (nights <= 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid date range',
      });
    }

    const room = await this.roomsRepository.findOne({
      where: { id: data.roomId },
    });

    if (!room) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${data.roomId} not found`,
      });
    }

    if (typeof data.guests === 'number' && data.guests > room.capacity) {
      throw new RpcException({
        statusCode: 400,
        message: `Selected room capacity (${room.capacity}) is less than requested guests (${data.guests})`,
      });
    }

    if (data.guestId) {
      const guest = await this.guestsRepository.findOne({
        where: { id: data.guestId },
      });

      if (!guest) {
        throw new RpcException({
          statusCode: 404,
          message: `Guest with id ${data.guestId} not found`,
        });
      }
    }

    const blockingStatuses: ReservationStatus[] = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
    ];

    const overlapCount = await this.reservationsRepository.count({
      where: {
        roomId: data.roomId,
        status: In(blockingStatuses),
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
      },
    });

    if (overlapCount > 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Room is not available for the selected date range',
      });
    }

    let baseTotal = Number(room.price) * nights;

    if (data.discountPercent && Number(data.discountPercent) > 0) {
      baseTotal = baseTotal - baseTotal * (Number(data.discountPercent) / 100);
    }

    if (data.discountAmount && Number(data.discountAmount) > 0) {
      baseTotal = baseTotal - Number(data.discountAmount);
    }

    if (baseTotal < 0) {
      baseTotal = 0;
    }

    const created = await this.reservationsRepository.save({
      ...data,
      checkInDate,
      checkOutDate,
      nights,
      totalAmount: baseTotal,
    });

    this.notificationsService
      .create({
        title: 'New reservation',
        message: `Reservation #${created.id} created for room ${room.number} (${nights} night${nights !== 1 ? 's' : ''})`,
        type: NotificationType.INFO,
        refId: created.id,
        refType: 'reservation',
        userId: null,
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return created;
  }

  async update(
    id: number,
    data: UpdateReservationDto,
  ): Promise<ReservationDto> {
    const existing = await this.reservationsRepository.findOne({
      where: { id },
      relations: this.reservationRelations,
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Reservation with id ${id} not found`,
      });
    }

    const checkInDate = data.checkInDate ?? existing.checkInDate;
    const checkOutDate = data.checkOutDate ?? existing.checkOutDate;

    const nights =
      data.checkInDate || data.checkOutDate
        ? this.calculateNights(checkInDate, checkOutDate)
        : existing.nights;

    if (nights <= 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid date range',
      });
    }

    const roomId = data.roomId ?? existing.roomId;
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${roomId} not found`,
      });
    }

    const guests =
      typeof data.guests === 'number' ? data.guests : existing.guests;

    if (typeof guests === 'number' && guests > room.capacity) {
      throw new RpcException({
        statusCode: 400,
        message: `Selected room capacity (${room.capacity}) is less than requested guests (${guests})`,
      });
    }

    if (typeof data.guestId !== 'undefined' && data.guestId) {
      const guest = await this.guestsRepository.findOne({
        where: { id: data.guestId },
      });

      if (!guest) {
        throw new RpcException({
          statusCode: 404,
          message: `Guest with id ${data.guestId} not found`,
        });
      }
    }

    if (data.roomId || data.checkInDate || data.checkOutDate) {
      const blockingStatuses: ReservationStatus[] = [
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN,
      ];

      const conflict = await this.reservationsRepository
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
        throw new RpcException({
          statusCode: 400,
          message: 'Room is not available for the selected date range',
        });
      }
    }

    const nextDiscountPercent =
      typeof data.discountPercent !== 'undefined'
        ? data.discountPercent
        : existing.discountPercent;

    const nextDiscountAmount =
      typeof data.discountAmount !== 'undefined'
        ? data.discountAmount
        : existing.discountAmount;

    const shouldRecalculateTotal =
      data.roomId ||
      data.checkInDate ||
      data.checkOutDate ||
      typeof data.discountPercent !== 'undefined' ||
      typeof data.discountAmount !== 'undefined';

    let totalAmount = existing.totalAmount;

    if (shouldRecalculateTotal) {
      let newTotal = Number(room.price) * nights;

      const discountPercent = Number(nextDiscountPercent ?? 0);
      const discountAmount = Number(nextDiscountAmount ?? 0);

      if (discountPercent > 0) {
        newTotal = newTotal - newTotal * (discountPercent / 100);
      }

      if (discountAmount > 0) {
        newTotal = newTotal - discountAmount;
      }

      if (newTotal < 0) {
        newTotal = 0;
      }

      totalAmount = newTotal;
    }

    if (typeof data.status !== 'undefined') {
      if (
        data.status === ReservationStatus.CONFIRMED ||
        data.status === ReservationStatus.CHECKED_IN
      ) {
        await this.roomsRepository.update(roomId, {
          isAvailable: false,
        });
      }

      if (data.status === ReservationStatus.CANCELLED) {
        await this.roomsRepository.update(roomId, {
          isAvailable: true,
        });
      }
    }

    await this.reservationsRepository.update(id, {
      ...data,
      checkInDate,
      checkOutDate,
      nights,
      roomId,
      guests,
      totalAmount,
      discountPercent: nextDiscountPercent,
      discountAmount: nextDiscountAmount,
    });

    return this.findOne(id);
  }

  async checkout(id: number): Promise<CheckoutReservationResponseDto> {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CHECKED_OUT) {
      return { reservation };
    }

    await this.reservationsRepository.update(id, {
      status: ReservationStatus.CHECKED_OUT,
    });

    if (reservation.roomId) {
      await this.roomsRepository.update(reservation.roomId, {
        isAvailable: false,
      });
    }

    this.notificationsService
      .create({
        title: 'Checkout completed',
        message: `Reservation #${reservation.id} checked out`,
        type: NotificationType.INFO,
        refId: reservation.id,
        refType: 'reservation',
        userId: null,
      })
      .subscribe({
        error: () => {
          return;
        },
      });

    return {
      reservation: await this.findOne(id),
      assignmentId: null,
      invoiceId: null,
    };
  }

  async remove(id: number): Promise<ReservationDto> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: this.reservationRelations,
    });

    if (!reservation) {
      throw new RpcException({
        statusCode: 404,
        message: `Reservation with id ${id} not found`,
      });
    }

    await this.reservationsRepository.remove(reservation);
    return reservation;
  }

  private calculateNights(checkInDate: Date, checkOutDate: Date): number {
    return Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}

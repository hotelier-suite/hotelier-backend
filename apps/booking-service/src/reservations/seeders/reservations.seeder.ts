import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BookingChannel,
  ReservationStatus,
} from '@app/contracts/booking-service';
import { Guest } from '../../guests';
import { Room } from '../../rooms';
import { Reservation } from '../entities';

@Injectable()
export class ReservationsSeeder {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Guest)
    private readonly guestsRepository: Repository<Guest>,
  ) {}

  async seed(): Promise<void> {
    const rooms = await this.roomsRepository.find({
      order: { id: 'ASC' },
    });

    const guests = await this.guestsRepository.find({
      order: { id: 'ASC' },
    });

    if (rooms.length === 0 || guests.length === 0) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations: Array<
      Omit<
        Reservation,
        'id' | 'createdAt' | 'updatedAt' | 'room' | 'guest' | 'totalAmount'
      > & { totalAmount: number }
    > = [
      {
        guestName: guests[0].name,
        guestEmail: guests[0].email,
        guestPhone: guests[0].phone,
        checkInDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        checkOutDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        nights: 2,
        guests: 1,
        totalAmount: Number(rooms[0].price) * 2,
        discountPercent: null,
        discountAmount: null,
        status: ReservationStatus.CHECKED_IN,
        channel: BookingChannel.DIRECT,
        notes: 'Seeded checked-in reservation',
        userId: 1,
        roomId: rooms[0].id,
        guestId: guests[0].id,
      },
      {
        guestName: guests[1]?.name ?? guests[0].name,
        guestEmail: guests[1]?.email ?? guests[0].email,
        guestPhone: guests[1]?.phone,
        checkInDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        checkOutDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        nights: 3,
        guests: 2,
        totalAmount: Number(rooms[1].price) * 3,
        discountPercent: 10,
        discountAmount: null,
        status: ReservationStatus.CONFIRMED,
        channel: BookingChannel.DIRECT,
        notes: 'Seeded confirmed reservation',
        userId: 2,
        roomId: rooms[1].id,
        guestId: guests[1]?.id ?? guests[0].id,
      },
    ];

    for (const data of reservations) {
      const existing = await this.reservationsRepository.findOne({
        where: {
          roomId: data.roomId,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
        },
      });

      if (!existing) {
        await this.reservationsRepository.save(data);

        if (
          data.status === ReservationStatus.CONFIRMED ||
          data.status === ReservationStatus.CHECKED_IN
        ) {
          await this.roomsRepository.update(data.roomId, {
            isAvailable: false,
          });
        }
      }
    }
  }
}

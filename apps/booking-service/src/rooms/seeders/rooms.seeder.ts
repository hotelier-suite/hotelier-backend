import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from '@app/contracts/booking-service/rooms/enums/room-type.enum';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomsSeeder {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async seed(): Promise<void> {
    const rooms = [
      ...Array.from({ length: 10 }, (_, i) => ({
        number: `10${i + 1}`,
        type: RoomType.INDIVIDUAL,
        price: 50.0,
        capacity: 1,
        isAvailable: true,
        description: 'Comfortable single room with basic amenities',
      })),
      ...Array.from({ length: 20 }, (_, i) => ({
        number: `2${String(i + 1).padStart(2, '0')}`,
        type: RoomType.DOBLE,
        price: 75.0,
        capacity: 2,
        isAvailable: true,
        description: 'Spacious double room with modern amenities',
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        number: `30${i + 1}`,
        type: RoomType.SUITE,
        price: 150.0,
        capacity: 2,
        isAvailable: true,
        description: 'Luxury suite with premium amenities and city view',
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        number: `40${i + 1}`,
        type: RoomType.FAMILIAR,
        price: 120.0,
        capacity: 4,
        isAvailable: true,
        description: 'Family-friendly room with extra space and amenities',
      })),
    ];

    for (const roomData of rooms) {
      const existingRoom = await this.roomsRepository.findOne({
        where: { number: roomData.number },
      });

      if (!existingRoom) {
        await this.roomsRepository.save(roomData);
      }
    }
  }
}

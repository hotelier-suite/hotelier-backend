import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { RoomType } from '../../enums/room-type.enum';

@Injectable()
export class RoomsSeeder {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async seed() {
    const rooms = [
      // Individual rooms (101-110)
      ...Array.from({ length: 10 }, (_, i) => ({
        number: `10${i + 1}`,
        type: RoomType.INDIVIDUAL,
        price: 50.0,
        capacity: 1,
        isAvailable: true,
        description: 'Comfortable single room with basic amenities',
      })),

      // Double rooms (201-220)
      ...Array.from({ length: 20 }, (_, i) => ({
        number: `2${String(i + 1).padStart(2, '0')}`,
        type: RoomType.DOBLE,
        price: 75.0,
        capacity: 2,
        isAvailable: true,
        description: 'Spacious double room with modern amenities',
      })),

      // Suites (301-305)
      ...Array.from({ length: 5 }, (_, i) => ({
        number: `30${i + 1}`,
        type: RoomType.SUITE,
        price: 150.0,
        capacity: 2,
        isAvailable: true,
        description: 'Luxury suite with premium amenities and city view',
      })),

      // Family rooms (401-410)
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
      const existingRoom = await this.roomRepository.findOne({
        where: { number: roomData.number },
      });

      if (!existingRoom) {
        await this.roomRepository.save(roomData);
      }
    }
  }
}

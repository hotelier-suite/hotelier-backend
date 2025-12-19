import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find({
      order: {
        number: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Room | null> {
    return this.roomRepository.findOne({
      where: { id },
    });
  }

  async create(data: CreateRoomDto): Promise<Room> {
    return this.roomRepository.save(data);
  }

  async update(id: number, data: UpdateRoomDto): Promise<Room> {
    const existingRoom = await this.findOne(id);
    if (!existingRoom) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    await this.roomRepository.update(id, data);
    const updatedRoom = await this.findOne(id);
    return updatedRoom!;
  }

  async delete(id: number): Promise<Room> {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    await this.roomRepository.remove(room);
    return room;
  }
}

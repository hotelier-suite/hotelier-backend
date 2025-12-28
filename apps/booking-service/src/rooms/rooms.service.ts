import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
  FindRoomsFilterDto,
} from '@app/contracts/booking-service';
import { Room } from './entities';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  findAll(filters: FindRoomsFilterDto): Promise<RoomDto[]> {
    const where: FindOptionsWhere<Room> = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (typeof filters.available === 'boolean') {
      where.isAvailable = filters.available;
    }

    return this.roomsRepository.find({
      where,
      order: { number: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RoomDto> {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${id} not found`,
      });
    }

    return room;
  }

  async create(data: CreateRoomDto): Promise<RoomDto> {
    const existing = await this.roomsRepository.findOne({
      where: { number: data.number },
    });

    if (existing) {
      throw new RpcException({
        statusCode: 400,
        message: `Room with number ${data.number} already exists`,
      });
    }

    const created = await this.roomsRepository.save({
      ...data,
      isAvailable: true,
    });

    const loaded = await this.roomsRepository.findOne({
      where: { id: created.id },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load room with id ${created.id} after creation`,
      });
    }

    return loaded;
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomDto> {
    const existing = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${id} not found`,
      });
    }

    if (data.number && data.number !== existing.number) {
      const duplicate = await this.roomsRepository.findOne({
        where: { number: data.number },
      });

      if (duplicate) {
        throw new RpcException({
          statusCode: 400,
          message: `Room with number ${data.number} already exists`,
        });
      }
    }

    await this.roomsRepository.update(id, data);

    const updated = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!updated) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${id} not found`,
      });
    }

    return updated;
  }

  async remove(id: number): Promise<RoomDto> {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new RpcException({
        statusCode: 404,
        message: `Room with id ${id} not found`,
      });
    }

    await this.roomsRepository.remove(room);
    return room;
  }

  async setAvailability(id: number, isAvailable: boolean): Promise<RoomDto> {
    await this.findOne(id);

    await this.roomsRepository.update(id, {
      isAvailable,
    });

    return this.findOne(id);
  }
}

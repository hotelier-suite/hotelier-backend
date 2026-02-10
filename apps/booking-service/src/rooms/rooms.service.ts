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

    const entity = this.roomsRepository.create(data);
    return this.roomsRepository.save(entity);
  }

  async update(id: number, data: UpdateRoomDto): Promise<RoomDto> {
    const existing = await this.findOne(id);

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

    const entity = this.roomsRepository.create(existing);
    const merged = this.roomsRepository.merge(entity, data);
    return this.roomsRepository.save(merged);
  }

  async remove(id: number): Promise<RoomDto> {
    const room = await this.findOne(id);
    const entity = this.roomsRepository.create(room);
    return this.roomsRepository.remove(entity);
  }

  async setAvailability(id: number, isAvailable: boolean): Promise<RoomDto> {
    const existing = await this.findOne(id);
    const entity = this.roomsRepository.create(existing);
    const merged = this.roomsRepository.merge(entity, { isAvailable });
    return this.roomsRepository.save(merged);
  }
}

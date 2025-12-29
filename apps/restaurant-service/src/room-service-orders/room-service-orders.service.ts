import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { RoomServiceOrder } from './entities';
import {
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
  RoomServiceStatus,
} from '@app/contracts/restaurant-service';

@Injectable()
export class RoomServiceOrdersService {
  constructor(
    @InjectRepository(RoomServiceOrder)
    private readonly roomServiceOrderRepository: Repository<RoomServiceOrder>,
  ) {}

  private readonly roomServiceOrderSelect: FindOptionsSelect<RoomServiceOrder> =
    {
      id: true,
      orderNumber: true,
      room: true,
      guest: true,
      items: true,
      total: true,
      orderDate: true,
      estimatedTime: true,
      status: true,
      waiter: true,
      specialInstructions: true,
      guestId: true,
      createdAt: true,
      updatedAt: true,
    };

  findAll(): Promise<RoomServiceOrderDto[]> {
    return this.roomServiceOrderRepository.find({
      select: this.roomServiceOrderSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.roomServiceOrderRepository.findOne({
      where: { id },
      select: this.roomServiceOrderSelect,
    });

    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: `Room service order with id ${id} not found`,
      });
    }

    return order;
  }

  async create(data: CreateRoomServiceOrderDto): Promise<RoomServiceOrderDto> {
    const entity = this.roomServiceOrderRepository.create(data);
    return this.roomServiceOrderRepository.save(entity);
  }

  async update(
    id: number,
    data: UpdateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
    const existing = await this.findOne(id);
    const entity = this.roomServiceOrderRepository.create(existing);
    const merged = this.roomServiceOrderRepository.merge(entity, data);
    return this.roomServiceOrderRepository.save(merged);
  }

  async remove(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.findOne(id);
    const entity = this.roomServiceOrderRepository.create(order);
    return this.roomServiceOrderRepository.remove(entity);
  }
}

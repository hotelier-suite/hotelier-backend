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

  private readonly roomServiceOrderReadSelect: FindOptionsSelect<RoomServiceOrder> =
    {
      id: true,
      orderNumber: true,
      room: true,
      guest: true,
      items: true,
      total: true,
      orderTime: true,
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
      select: this.roomServiceOrderReadSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.roomServiceOrderRepository.findOne({
      where: { id },
      select: this.roomServiceOrderReadSelect,
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
    const count = await this.roomServiceOrderRepository.count();
    const orderNumber = `RS${String(count + 1).padStart(3, '0')}`;

    const order = await this.roomServiceOrderRepository.save({
      ...data,
      orderNumber,
      orderTime: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: RoomServiceStatus.PENDING,
    });

    const loaded = await this.roomServiceOrderRepository.findOne({
      where: { id: order.id },
      select: this.roomServiceOrderReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load order with id ${order.id} after creation`,
      });
    }

    return loaded;
  }

  async update(
    id: number,
    data: UpdateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
    const existing = await this.roomServiceOrderRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Room service order with id ${id} not found`,
      });
    }

    await this.roomServiceOrderRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.roomServiceOrderRepository.findOne({
      where: { id },
      select: this.roomServiceOrderReadSelect,
    });

    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: `Room service order with id ${id} not found`,
      });
    }

    await this.roomServiceOrderRepository.remove(order);
    return order;
  }
}

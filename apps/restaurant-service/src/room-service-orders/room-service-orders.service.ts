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
    private readonly orderRepository: Repository<RoomServiceOrder>,
  ) {}

  private readonly readSelect: FindOptionsSelect<RoomServiceOrder> = {
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
    return this.orderRepository.find({
      select: this.readSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: this.readSelect,
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
    const count = await this.orderRepository.count();
    const orderNumber = `RS${String(count + 1).padStart(3, '0')}`;

    const order = await this.orderRepository.save({
      ...data,
      orderNumber,
      orderTime: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: RoomServiceStatus.PENDING,
    });

    const loaded = await this.orderRepository.findOne({
      where: { id: order.id },
      select: this.readSelect,
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
    const existing = await this.orderRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Room service order with id ${id} not found`,
      });
    }

    await this.orderRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: this.readSelect,
    });

    if (!order) {
      throw new RpcException({
        statusCode: 404,
        message: `Room service order with id ${id} not found`,
      });
    }

    await this.orderRepository.remove(order);
    return order;
  }
}

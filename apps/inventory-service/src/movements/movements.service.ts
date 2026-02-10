import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from './entities';
import { InventoryItem } from '../items';
import {
  InventoryMovementDto,
  CreateInventoryMovementDto,
  MovementType,
  InventoryStatus,
} from '@app/contracts/inventory-service';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  findAll(): Promise<InventoryMovementDto[]> {
    return this.inventoryMovementRepository.find({
      relations: { inventory: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    data: CreateInventoryMovementDto,
  ): Promise<InventoryMovementDto> {
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id: data.inventoryId },
    });

    if (!inventoryItem) {
      throw new RpcException({
        statusCode: 404,
        message: `Inventory item with id ${data.inventoryId} not found`,
      });
    }

    const previousStock = inventoryItem.currentStock;

    const newStock =
      data.type === MovementType.IN
        ? previousStock + data.quantity
        : previousStock - data.quantity;

    if (newStock < 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Insufficient stock for movement',
      });
    }

    const entity = this.inventoryMovementRepository.create({
      ...data,
      previousStock,
      newStock,
      cost: data.cost ?? null,
      inventory: inventoryItem,
    });
    const savedMovement = await this.inventoryMovementRepository.save(entity);

    const newStatus = this.calculateItemStatus(
      newStock,
      inventoryItem.minimumStock,
    );

    await this.inventoryItemRepository.update(inventoryItem.id, {
      currentStock: newStock,
      status: newStatus,
    });

    return savedMovement;
  }

  private calculateItemStatus(
    currentStock: number,
    minimumStock: number,
  ): InventoryStatus {
    if (currentStock === 0) {
      return InventoryStatus.OUT_OF_STOCK;
    }

    if (currentStock <= minimumStock) {
      return InventoryStatus.LOW_STOCK;
    }

    return InventoryStatus.AVAILABLE;
  }
}

import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { InventoryItem } from '../items/entities/inventory-item.entity';
import { InventoryMovementDto } from '@app/contracts/inventory-service/movements/dto/inventory-movement.dto';
import { CreateInventoryMovementDto } from '@app/contracts/inventory-service/movements/dto/create-inventory-movement.dto';
import { MovementType } from '@app/contracts/inventory-service/movements/enums/movement-type.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  findAll(): Promise<InventoryMovementDto[]> {
    return this.movementRepository.find({
      relations: { inventory: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    data: CreateInventoryMovementDto,
  ): Promise<InventoryMovementDto> {
    const inventoryItem = await this.inventoryRepository.findOne({
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

    const movement = this.movementRepository.create({
      ...data,
      previousStock,
      newStock,
      cost: data.cost ?? null,
      inventory: inventoryItem,
    });

    const savedMovement = await this.movementRepository.save(movement);

    inventoryItem.currentStock = newStock;
    inventoryItem.status = this.calculateItemStatus(
      inventoryItem.currentStock,
      inventoryItem.minimumStock,
    );

    await this.inventoryRepository.save(inventoryItem);

    const loaded = await this.movementRepository.findOne({
      where: { id: savedMovement.id },
      relations: { inventory: true },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load inventory movement with id ${savedMovement.id} after creation`,
      });
    }

    return loaded;
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

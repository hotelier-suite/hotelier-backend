import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { InventoryItem } from '../../items/entities/inventory-item.entity';
import { MovementType } from '@app/contracts/inventory-service/movements/enums/movement-type.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';

type MovementSeedData = {
  type: MovementType;
  inventoryId: number;
  quantity: number;
  reason: string;
  cost?: number;
  user: string;
  responsible?: string;
  notes?: string;
};

@Injectable()
export class MovementsSeeder {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  async seed(): Promise<void> {
    const inventoryItems = await this.inventoryRepository.find({ take: 5 });

    const item0 = inventoryItems[0];
    const item1 = inventoryItems[1];

    const movements: MovementSeedData[] = [
      ...(item0
        ? [
            {
              type: MovementType.IN,
              inventoryId: item0.id,
              quantity: 10,
              reason: 'Initial stock purchase',
              cost: 25.5,
              user: 'system',
              responsible: 'Inventory Manager',
              notes: 'Initial inventory setup',
            },
            {
              type: MovementType.OUT,
              inventoryId: item0.id,
              quantity: 2,
              reason: 'Use for room cleaning',
              user: 'housekeeping_staff',
              responsible: 'Mary Johnson',
              notes: 'Used for rooms 201-210',
            },
          ]
        : []),
      ...(item1
        ? [
            {
              type: MovementType.IN,
              inventoryId: item1.id,
              quantity: 5,
              reason: 'Weekly restocking',
              cost: 18.75,
              user: 'inventory_manager',
              responsible: 'John Smith',
              notes: 'Weekly order #WK2024-01',
            },
          ]
        : []),
    ];

    for (const movementData of movements) {
      const existing = await this.movementRepository.findOne({
        where: {
          inventoryId: movementData.inventoryId,
          type: movementData.type,
          quantity: movementData.quantity,
          reason: movementData.reason,
        },
      });

      if (!existing) {
        const inventoryItem = await this.inventoryRepository.findOne({
          where: { id: movementData.inventoryId },
        });

        if (!inventoryItem) {
          continue;
        }

        const previousStock = inventoryItem.currentStock;
        const newStock =
          movementData.type === MovementType.IN
            ? previousStock + movementData.quantity
            : previousStock - movementData.quantity;

        if (newStock < 0) {
          continue;
        }

        await this.movementRepository.save({
          ...movementData,
          previousStock,
          newStock,
          cost: movementData.cost ?? null,
          inventory: inventoryItem,
        });

        inventoryItem.currentStock = newStock;
        inventoryItem.status = this.calculateItemStatus(
          inventoryItem.currentStock,
          inventoryItem.minimumStock,
        );

        await this.inventoryRepository.save(inventoryItem);
      }
    }
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

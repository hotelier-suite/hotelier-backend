import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities';
import {
  InventoryItemDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryStatus,
  FindInventoryItemsFilterDto,
} from '@app/contracts/inventory-service';
import { NotificationType } from '@app/contracts/notifications-service';
import { NotificationsService } from '../notifications-service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll(filters: FindInventoryItemsFilterDto): Promise<InventoryItemDto[]> {
    return this.inventoryItemRepository.find({
      where: filters,
      order: { name: 'ASC' },
    });
  }

  async create(data: CreateInventoryItemDto): Promise<InventoryItemDto> {
    const status = this.calculateItemStatus(
      data.currentStock,
      data.minimumStock,
    );

    const created = await this.inventoryItemRepository.save({
      ...data,
      status,
    });

    const loaded = await this.inventoryItemRepository.findOne({
      where: { id: created.id },
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load inventory item with id ${created.id} after creation`,
      });
    }

    this.notifyStockChange(null, loaded.status, loaded);

    return loaded;
  }

  async update(
    id: number,
    data: UpdateInventoryItemDto,
  ): Promise<InventoryItemDto> {
    const existing = await this.inventoryItemRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Inventory item with id ${id} not found`,
      });
    }

    const currentStock = data.currentStock ?? existing.currentStock;
    const minimumStock = data.minimumStock ?? existing.minimumStock;
    const status = this.calculateItemStatus(currentStock, minimumStock);

    await this.inventoryItemRepository.update(id, {
      ...data,
      status,
    });

    const updated = await this.inventoryItemRepository.findOne({
      where: { id },
    });

    if (!updated) {
      throw new RpcException({
        statusCode: 404,
        message: `Inventory item with id ${id} not found`,
      });
    }

    this.notifyStockChange(existing.status, updated.status, updated);

    return updated;
  }

  async remove(id: number): Promise<InventoryItemDto> {
    const item = await this.inventoryItemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new RpcException({
        statusCode: 404,
        message: `Inventory item with id ${id} not found`,
      });
    }

    await this.inventoryItemRepository.remove(item);
    return item;
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

  private notifyStockChange(
    previousStatus: InventoryStatus | null,
    nextStatus: InventoryStatus,
    item: InventoryItem,
  ): void {
    if (
      nextStatus === InventoryStatus.LOW_STOCK ||
      nextStatus === InventoryStatus.OUT_OF_STOCK
    ) {
      const title =
        nextStatus === InventoryStatus.OUT_OF_STOCK
          ? 'Inventory out of stock'
          : 'Low inventory';

      const message = `Inventory item '${item.name}' has ${nextStatus === InventoryStatus.OUT_OF_STOCK ? 'no stock' : 'low stock'} (current: ${item.currentStock}, minimum: ${item.minimumStock}).`;

      this.notificationsService
        .create({
          type:
            nextStatus === InventoryStatus.OUT_OF_STOCK
              ? NotificationType.ALERT
              : NotificationType.WARNING,
          title,
          message,
          refId: item.id,
          refType: 'inventory',
          userId: null,
        })
        .subscribe({
          error: () => {
            return;
          },
        });

      return;
    }

    if (
      previousStatus != null &&
      previousStatus !== InventoryStatus.AVAILABLE &&
      nextStatus === InventoryStatus.AVAILABLE
    ) {
      this.notificationsService
        .create({
          type: NotificationType.INFO,
          title: 'Inventory recovered',
          message: `Inventory item '${item.name}' has recovered sufficient stock (current: ${item.currentStock}).`,
          refId: item.id,
          refType: 'inventory',
          userId: null,
        })
        .subscribe({
          error: () => {
            return;
          },
        });
    }
  }
}

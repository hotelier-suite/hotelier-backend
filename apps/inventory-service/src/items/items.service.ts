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

  async findOne(id: number): Promise<InventoryItemDto> {
    const item = await this.inventoryItemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new RpcException({
        statusCode: 404,
        message: `Inventory item with id ${id} not found`,
      });
    }

    return item;
  }

  async create(data: CreateInventoryItemDto): Promise<InventoryItemDto> {
    const entity = this.inventoryItemRepository.create(data);
    const created = await this.inventoryItemRepository.save(entity);

    this.notifyStockChange(null, created.status, created);

    return created;
  }

  async update(
    id: number,
    data: UpdateInventoryItemDto,
  ): Promise<InventoryItemDto> {
    const existing = await this.findOne(id);
    const previousStatus = existing.status;
    const entity = this.inventoryItemRepository.create(existing);
    const merged = this.inventoryItemRepository.merge(entity, data);
    const updated = await this.inventoryItemRepository.save(merged);

    this.notifyStockChange(previousStatus, updated.status, updated);

    return updated;
  }

  async remove(id: number): Promise<InventoryItemDto> {
    const item = await this.findOne(id);
    const entity = this.inventoryItemRepository.create(item);
    return this.inventoryItemRepository.remove(entity);
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

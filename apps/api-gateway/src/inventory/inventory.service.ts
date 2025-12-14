import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { Supplier } from './entities/supplier.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

import { SupplierResponseDto } from './dto/supplier-response.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { InventoryStatus } from './enums/inventory-status.enum';
import { InventoryCategory } from './enums/inventory-category.enum';
import { MovementType } from './enums/movement-type.enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Inventory Items
  async getInventoryItems(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async createInventoryItem(
    itemData: CreateInventoryItemDto,
  ): Promise<Inventory> {
    const status = this.calculateItemStatus(
      itemData.currentStock,
      itemData.minimumStock,
    );

    const saved = await this.inventoryRepository.save({
      ...itemData,
      status,
    });

    // Create notification if initial state is low/out of stock
    if (
      status === InventoryStatus.LOW_STOCK ||
      status === InventoryStatus.OUT_OF_STOCK
    ) {
      const title =
        status === InventoryStatus.OUT_OF_STOCK
          ? 'Inventory out of stock'
          : 'Low inventory';
      const message = `Inventory item '${saved.name}' has ${status === InventoryStatus.OUT_OF_STOCK ? 'no stock' : 'low stock'} (current: ${saved.currentStock}, minimum: ${saved.minimumStock}).`;
      await this.notificationsService.create({
        type:
          status === InventoryStatus.OUT_OF_STOCK
            ? NotificationType.ALERT
            : NotificationType.WARNING,
        title,
        message,
        refId: saved.id,
        refType: 'inventory',
        userId: null,
      });
    }

    return saved;
  }

  async updateInventoryItem(
    id: number,
    updateData: UpdateInventoryItemDto,
  ): Promise<Inventory> {
    const existingItem = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!existingItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const currentStock = updateData.currentStock ?? existingItem.currentStock;
    const minimumStock = updateData.minimumStock ?? existingItem.minimumStock;
    const status = this.calculateItemStatus(currentStock, minimumStock);

    await this.inventoryRepository.update(id, {
      ...updateData,
      status,
    });

    const updated = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!updated) {
      throw new NotFoundException(`Inventory item with id ${id} not found`);
    }

    // Notify when going low/out-of-stock or recovery to available
    if (
      status === InventoryStatus.LOW_STOCK ||
      status === InventoryStatus.OUT_OF_STOCK
    ) {
      const title =
        status === InventoryStatus.OUT_OF_STOCK
          ? 'Inventory out of stock'
          : 'Low inventory';
      const message = `Inventory item '${updated.name}' has ${status === InventoryStatus.OUT_OF_STOCK ? 'no stock' : 'low stock'} (current: ${currentStock}, minimum: ${minimumStock}).`;
      await this.notificationsService.create({
        type:
          status === InventoryStatus.OUT_OF_STOCK
            ? NotificationType.ALERT
            : NotificationType.WARNING,
        title,
        message,
        refId: updated.id,
        refType: 'inventory',
      });
    } else if (
      existingItem.status !== InventoryStatus.AVAILABLE &&
      status === InventoryStatus.AVAILABLE
    ) {
      // Recovery notification
      await this.notificationsService.create({
        type: NotificationType.INFO,
        title: 'Inventory recovered',
        message: `Inventory item '${updated.name}' has recovered sufficient stock (current: ${currentStock}).`,
        refId: updated.id,
        refType: 'inventory',
      });
    }

    return updated;
  }

  async deleteInventoryItem(id: number): Promise<Inventory> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with id ${id} not found`);
    }

    await this.inventoryRepository.remove(item);
    return item;
  }

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return this.movementRepository.find({
      relations: { inventory: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createMovement(
    movementData: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    const { inventoryId, quantity, type, reason, cost } = movementData;

    const item = await this.inventoryRepository.findOne({
      where: { id: inventoryId },
    });
    if (!item) {
      throw new NotFoundException(
        `Inventory item with ID ${inventoryId} not found`,
      );
    }

    // Update item quantity
    if (type === MovementType.IN) {
      item.currentStock += quantity;
    } else {
      if (item.currentStock < quantity) {
        throw new Error('Insufficient stock for outbound movement');
      }
      item.currentStock -= quantity;
    }

    await this.inventoryRepository.save(item);

    // Check for low stock alerts after movement
    await this.checkLowStockAlert(item);

    // Create movement record
    const movement = this.movementRepository.create({
      quantity,
      type,
      reason,
      cost: cost ? cost * quantity : undefined,
    });

    return this.movementRepository.save(movement);
  }

  async getInventoryAlerts(): Promise<Inventory[]> {
    return this.inventoryRepository
      .createQueryBuilder('item')
      .where('item.currentStock <= item.minimumStock')
      .orderBy('item.currentStock', 'ASC')
      .getMany();
  }

  private async checkLowStockAlert(item: Inventory): Promise<void> {
    if (item.currentStock <= item.minimumStock) {
      const message =
        item.currentStock === 0
          ? `OUT OF STOCK: ${item.name} has no inventory`
          : `LOW STOCK: ${item.name} - ${item.currentStock} units remaining (minimum: ${item.minimumStock})`;

      try {
        await this.notificationsService.create({
          title: item.currentStock === 0 ? 'Product Out of Stock' : 'Low Stock',
          message,
          type: NotificationType.WARNING,
          refId: item.id,
          refType: 'inventory',
        });
      } catch (error) {
        console.error('Error creating inventory alert:', error);
      }
    }
  }

  async checkAllLowStockItems(): Promise<void> {
    const lowStockItems = await this.getInventoryAlerts();
    for (const item of lowStockItems) {
      await this.checkLowStockAlert(item);
    }
  }

  async getSupplierList(): Promise<SupplierResponseDto[]> {
    // Load suppliers with their inventory items and compute the count safely
    const suppliers = await this.supplierRepository.find({
      relations: { inventoryItems: true },
      order: { name: 'ASC' },
    });

    return suppliers.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
      rating: supplier.rating,
      deliveryTime: supplier.deliveryTime,
      paymentTerms: supplier.paymentTerms,
      totalItems: supplier.inventoryItems?.length || 0,
    }));
  }

  async getSupplierById(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    return {
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
      rating: supplier.rating,
      deliveryTime: supplier.deliveryTime,
      paymentTerms: supplier.paymentTerms,
      totalItems: supplier.inventoryItems?.length || 0,
    };
  }

  async getInventoryByCategory(
    category: InventoryCategory,
  ): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }

  async getInventoryByStatus(status: InventoryStatus): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { status },
      order: { name: 'ASC' },
    });
  }

  async createSupplier(
    supplierData: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.save(supplierData);

    return {
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
      rating: supplier.rating,
      deliveryTime: supplier.deliveryTime,
      paymentTerms: supplier.paymentTerms,
      totalItems: 0, // New supplier starts with 0 items
    };
  }

  async updateSupplier(
    id: number,
    updateData: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!existingSupplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.supplierRepository.update(id, updateData);

    const updatedSupplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
    });

    if (!updatedSupplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    return {
      id: updatedSupplier.id,
      name: updatedSupplier.name,
      contact: updatedSupplier.contact,
      email: updatedSupplier.email,
      phone: updatedSupplier.phone,
      category: updatedSupplier.category,
      rating: updatedSupplier.rating,
      deliveryTime: updatedSupplier.deliveryTime,
      paymentTerms: updatedSupplier.paymentTerms,
      totalItems: updatedSupplier.inventoryItems?.length || 0,
    };
  }

  async deleteSupplier(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    // Check if supplier has inventory items
    if (supplier.inventoryItems && supplier.inventoryItems.length > 0) {
      throw new Error(
        'Cannot delete supplier with existing inventory items. Please reassign or remove inventory items first.',
      );
    }

    await this.supplierRepository.remove(supplier);

    return {
      id: supplier.id,
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
      rating: supplier.rating,
      deliveryTime: supplier.deliveryTime,
      paymentTerms: supplier.paymentTerms,
      totalItems: 0,
    };
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: {
        status: In([InventoryStatus.LOW_STOCK, InventoryStatus.OUT_OF_STOCK]),
      },
      relations: ['supplier', 'movements'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async createInventoryMovement(
    movementData: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    const inventoryItem = await this.inventoryRepository.findOne({
      where: { id: movementData.inventoryId },
    });

    if (!inventoryItem) {
      throw new NotFoundException(
        `Inventory item with id ${movementData.inventoryId} not found`,
      );
    }

    const movement = this.movementRepository.create({
      ...movementData,
      inventory: inventoryItem,
    });

    const savedMovement = await this.movementRepository.save(movement);

    // Update inventory stock based on movement
    if (movementData.type === MovementType.IN) {
      inventoryItem.currentStock += movementData.quantity;
    } else {
      inventoryItem.currentStock -= movementData.quantity;
    }

    // Update status based on new stock levels
    inventoryItem.status = this.calculateItemStatus(
      inventoryItem.currentStock,
      inventoryItem.minimumStock,
    );

    await this.inventoryRepository.save(inventoryItem);

    return savedMovement;
  }

  private calculateItemStatus(
    currentStock: number,
    minimumStock: number,
  ): InventoryStatus {
    if (currentStock === 0) {
      return InventoryStatus.OUT_OF_STOCK;
    } else if (currentStock <= minimumStock) {
      return InventoryStatus.LOW_STOCK;
    } else {
      return InventoryStatus.AVAILABLE;
    }
  }
}

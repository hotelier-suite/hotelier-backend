import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomServiceOrder } from './entities/room-service-order.entity';
import { MenuItem } from './entities/menu-item.entity';
import { BeverageInventory } from './entities/beverage-inventory.entity';
import { CreateRoomServiceOrderDto } from './dto/create-room-service-order.dto';
import { UpdateRoomServiceOrderDto } from './dto/update-room-service-order.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateBeverageItemDto } from './dto/create-beverage-item.dto';
import { RoomServiceStatus } from './enums/room-service-status.enum';
import { BeverageStatus } from './enums/beverage-status.enum';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RoomServiceOrder)
    private readonly roomServiceOrderRepository: Repository<RoomServiceOrder>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(BeverageInventory)
    private readonly beverageInventoryRepository: Repository<BeverageInventory>,
  ) {}

  // Room Service Orders
  async getRoomServiceOrders(): Promise<RoomServiceOrder[]> {
    return this.roomServiceOrderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createRoomServiceOrder(
    orderData: CreateRoomServiceOrderDto,
  ): Promise<RoomServiceOrder> {
    // Generate order number
    const count = await this.roomServiceOrderRepository.count();
    const orderNumber = `RS${String(count + 1).padStart(3, '0')}`;

    return await this.roomServiceOrderRepository.save({
      ...orderData,
      orderNumber,
      orderTime: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: RoomServiceStatus.PENDING,
    });
  }

  async updateRoomServiceOrder(
    id: number,
    orderData: UpdateRoomServiceOrderDto,
  ): Promise<RoomServiceOrder> {
    const existingOrder = await this.getRoomServiceOrderById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Room service order with id ${id} not found`);
    }

    await this.roomServiceOrderRepository.update(id, orderData);
    const updated = await this.getRoomServiceOrderById(id);
    return updated!;
  }

  async getRoomServiceOrderById(id: number): Promise<RoomServiceOrder | null> {
    return this.roomServiceOrderRepository.findOne({
      where: { id },
    });
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async createMenuItem(itemData: CreateMenuItemDto): Promise<MenuItem> {
    // Generate item code
    const count = await this.menuItemRepository.count();
    const itemCode = `MENU${String(count + 1).padStart(3, '0')}`;

    return await this.menuItemRepository.save({
      ...itemData,
      itemCode,
    });
  }

  async updateMenuItem(
    id: number,
    itemData: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    const existingItem = await this.getMenuItemById(id);
    if (!existingItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    await this.menuItemRepository.update(id, itemData);
    const updated = await this.getMenuItemById(id);
    return updated!;
  }

  async deleteMenuItem(id: number): Promise<MenuItem> {
    const item = await this.getMenuItemById(id);
    if (!item) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }
    await this.menuItemRepository.remove(item);
    return item;
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    return this.menuItemRepository.findOne({
      where: { id },
    });
  }

  // Beverage Inventory
  async getBeverageInventory(): Promise<BeverageInventory[]> {
    return this.beverageInventoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async createBeverageItem(
    itemData: CreateBeverageItemDto,
  ): Promise<BeverageInventory> {
    // Generate item code
    const count = await this.beverageInventoryRepository.count();
    const itemCode = `BEV${String(count + 1).padStart(3, '0')}`;

    // Calculate stock status
    const status =
      itemData.stock <= itemData.minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    return await this.beverageInventoryRepository.save({
      ...itemData,
      itemCode,
      status,
    });
  }

  async updateBeverageStock(
    id: number,
    stock: number,
  ): Promise<BeverageInventory> {
    const existingItem = await this.getBeverageItemById(id);
    if (!existingItem) {
      throw new NotFoundException(`Beverage item with id ${id} not found`);
    }

    // Calculate new status
    const status =
      stock <= existingItem.minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    await this.beverageInventoryRepository.update(id, { stock, status });
    const updated = await this.getBeverageItemById(id);
    return updated!;
  }

  async getBeverageItemById(id: number): Promise<BeverageInventory | null> {
    return this.beverageInventoryRepository.findOne({
      where: { id },
    });
  }

  async getLowStockBeverages(): Promise<BeverageInventory[]> {
    return this.beverageInventoryRepository.find({
      where: { status: BeverageStatus.LOW_STOCK },
      order: { name: 'ASC' },
    });
  }

  async getBeveragesByCategory(category: string): Promise<BeverageInventory[]> {
    return this.beverageInventoryRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }
}

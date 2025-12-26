import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem, RoomServiceOrder, BeverageInventory } from './entities';
import {
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
  RoomServiceStatus,
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  BeverageStatus,
} from '@app/contracts/restaurant-service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(RoomServiceOrder)
    private readonly roomServiceOrderRepository: Repository<RoomServiceOrder>,
    @InjectRepository(BeverageInventory)
    private readonly beverageInventoryRepository: Repository<BeverageInventory>,
  ) {}

  // Menu Items
  async findAllMenuItems(): Promise<MenuItemDto[]> {
    const items = await this.menuItemRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
    return items.map((item) => this.toMenuItemDto(item));
  }

  async findOneMenuItem(id: number): Promise<MenuItemDto> {
    const item = await this.menuItemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }
    return this.toMenuItemDto(item);
  }

  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItemDto> {
    const count = await this.menuItemRepository.count();
    const itemCode = `MENU${String(count + 1).padStart(3, '0')}`;

    const item = await this.menuItemRepository.save({
      ...data,
      itemCode,
      available: data.available ?? true,
    });
    return this.toMenuItemDto(item);
  }

  async updateMenuItem(
    id: number,
    data: UpdateMenuItemDto,
  ): Promise<MenuItemDto> {
    const existing = await this.menuItemRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    await this.menuItemRepository.update(id, data);
    return this.findOneMenuItem(id);
  }

  async deleteMenuItem(id: number): Promise<MenuItemDto> {
    const item = await this.menuItemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }
    const dto = this.toMenuItemDto(item);
    await this.menuItemRepository.remove(item);
    return dto;
  }

  // Room Service Orders
  async findAllOrders(): Promise<RoomServiceOrderDto[]> {
    const orders = await this.roomServiceOrderRepository.find({
      order: { createdAt: 'DESC' },
    });
    return orders.map((order) => this.toRoomServiceOrderDto(order));
  }

  async findOneOrder(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.roomServiceOrderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Room service order with id ${id} not found`);
    }
    return this.toRoomServiceOrderDto(order);
  }

  async createOrder(
    data: CreateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
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
    return this.toRoomServiceOrderDto(order);
  }

  async updateOrder(
    id: number,
    data: UpdateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
    const existing = await this.roomServiceOrderRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Room service order with id ${id} not found`);
    }

    await this.roomServiceOrderRepository.update(id, data);
    return this.findOneOrder(id);
  }

  async deleteOrder(id: number): Promise<RoomServiceOrderDto> {
    const order = await this.roomServiceOrderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Room service order with id ${id} not found`);
    }
    const dto = this.toRoomServiceOrderDto(order);
    await this.roomServiceOrderRepository.remove(order);
    return dto;
  }

  // Beverage Inventory
  async findAllBeverages(): Promise<BeverageInventoryDto[]> {
    const beverages = await this.beverageInventoryRepository.find({
      order: { name: 'ASC' },
    });
    return beverages.map((beverage) => this.toBeverageInventoryDto(beverage));
  }

  async findOneBeverage(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageInventoryRepository.findOne({
      where: { id },
    });
    if (!beverage) {
      throw new NotFoundException(`Beverage item with id ${id} not found`);
    }
    return this.toBeverageInventoryDto(beverage);
  }

  async createBeverage(
    data: CreateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    const count = await this.beverageInventoryRepository.count();
    const itemCode = `BEV${String(count + 1).padStart(3, '0')}`;

    const status =
      data.stock <= data.minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    const beverage = await this.beverageInventoryRepository.save({
      ...data,
      itemCode,
      status,
    });
    return this.toBeverageInventoryDto(beverage);
  }

  async updateBeverage(
    id: number,
    data: UpdateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    const existing = await this.beverageInventoryRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Beverage item with id ${id} not found`);
    }

    // Recalculate status if stock or minimumStock changed
    const stock = data.stock ?? existing.stock;
    const minimumStock = data.minimumStock ?? existing.minimumStock;
    const status =
      stock <= minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    await this.beverageInventoryRepository.update(id, { ...data, status });
    return this.findOneBeverage(id);
  }

  async updateBeverageStock(
    id: number,
    stock: number,
  ): Promise<BeverageInventoryDto> {
    const existing = await this.beverageInventoryRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Beverage item with id ${id} not found`);
    }

    const status =
      stock <= existing.minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    await this.beverageInventoryRepository.update(id, { stock, status });
    return this.findOneBeverage(id);
  }

  async deleteBeverage(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageInventoryRepository.findOne({
      where: { id },
    });
    if (!beverage) {
      throw new NotFoundException(`Beverage item with id ${id} not found`);
    }
    const dto = this.toBeverageInventoryDto(beverage);
    await this.beverageInventoryRepository.remove(beverage);
    return dto;
  }

  async findLowStockBeverages(): Promise<BeverageInventoryDto[]> {
    const beverages = await this.beverageInventoryRepository.find({
      where: { status: BeverageStatus.LOW_STOCK },
      order: { name: 'ASC' },
    });
    return beverages.map((beverage) => this.toBeverageInventoryDto(beverage));
  }

  async findBeveragesByCategory(
    category: string,
  ): Promise<BeverageInventoryDto[]> {
    const beverages = await this.beverageInventoryRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
    return beverages.map((beverage) => this.toBeverageInventoryDto(beverage));
  }

  // DTO Converters
  private toMenuItemDto(item: MenuItem): MenuItemDto {
    return {
      id: item.id,
      itemCode: item.itemCode,
      category: item.category,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      available: item.available,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients,
      allergens: item.allergens,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private toRoomServiceOrderDto(order: RoomServiceOrder): RoomServiceOrderDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      room: order.room,
      guest: order.guest,
      items: order.items,
      total: Number(order.total),
      orderTime: order.orderTime,
      estimatedTime: order.estimatedTime,
      status: order.status,
      waiter: order.waiter,
      specialInstructions: order.specialInstructions,
      guestId: order.guestId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private toBeverageInventoryDto(
    beverage: BeverageInventory,
  ): BeverageInventoryDto {
    return {
      id: beverage.id,
      itemCode: beverage.itemCode,
      name: beverage.name,
      category: beverage.category,
      stock: beverage.stock,
      minimumStock: beverage.minimumStock,
      unit: beverage.unit,
      unitCost: Number(beverage.unitCost),
      supplier: beverage.supplier,
      lastPurchase: beverage.lastPurchase,
      status: beverage.status,
      createdAt: beverage.createdAt,
      updatedAt: beverage.updatedAt,
    };
  }
}

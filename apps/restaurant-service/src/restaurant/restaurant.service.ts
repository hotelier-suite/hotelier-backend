import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
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

  private readonly menuItemReadSelect: FindOptionsSelect<MenuItem> = {
    id: true,
    itemCode: true,
    category: true,
    name: true,
    description: true,
    price: true,
    available: true,
    preparationTime: true,
    ingredients: true,
    allergens: true,
    createdAt: true,
    updatedAt: true,
  };

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

  private readonly beverageReadSelect: FindOptionsSelect<BeverageInventory> = {
    id: true,
    itemCode: true,
    name: true,
    category: true,
    stock: true,
    minimumStock: true,
    unit: true,
    unitCost: true,
    supplier: true,
    lastPurchase: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  };

  // Menu Items
  findAllMenuItems(): Promise<MenuItemDto[]> {
    return this.menuItemRepository.find({
      select: this.menuItemReadSelect,
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOneMenuItem(id: number): Promise<MenuItemDto> {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      select: this.menuItemReadSelect,
    });

    if (!item) {
      throw new RpcException({
        statusCode: 404,
        message: `Menu item with id ${id} not found`,
      });
    }

    return item;
  }

  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItemDto> {
    const count = await this.menuItemRepository.count();
    const itemCode = `MENU${String(count + 1).padStart(3, '0')}`;

    const item = await this.menuItemRepository.save({
      ...data,
      itemCode,
      available: data.available ?? true,
    });

    const loaded = await this.menuItemRepository.findOne({
      where: { id: item.id },
      select: this.menuItemReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load menu item with id ${item.id} after creation`,
      });
    }

    return loaded;
  }

  async updateMenuItem(
    id: number,
    data: UpdateMenuItemDto,
  ): Promise<MenuItemDto> {
    const existing = await this.menuItemRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Menu item with id ${id} not found`,
      });
    }

    await this.menuItemRepository.update(id, data);
    return this.findOneMenuItem(id);
  }

  async deleteMenuItem(id: number): Promise<MenuItemDto> {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      select: this.menuItemReadSelect,
    });

    if (!item) {
      throw new RpcException({
        statusCode: 404,
        message: `Menu item with id ${id} not found`,
      });
    }

    await this.menuItemRepository.remove(item);
    return item;
  }

  // Room Service Orders
  findAllOrders(): Promise<RoomServiceOrderDto[]> {
    return this.roomServiceOrderRepository.find({
      select: this.roomServiceOrderReadSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOrder(id: number): Promise<RoomServiceOrderDto> {
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

  async updateOrder(
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
    return this.findOneOrder(id);
  }

  async deleteOrder(id: number): Promise<RoomServiceOrderDto> {
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

  // Beverage Inventory
  findAllBeverages(): Promise<BeverageInventoryDto[]> {
    return this.beverageInventoryRepository.find({
      select: this.beverageReadSelect,
      order: { name: 'ASC' },
    });
  }

  async findOneBeverage(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageInventoryRepository.findOne({
      where: { id },
      select: this.beverageReadSelect,
    });

    if (!beverage) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

    return beverage;
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

    const loaded = await this.beverageInventoryRepository.findOne({
      where: { id: beverage.id },
      select: this.beverageReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load beverage with id ${beverage.id} after creation`,
      });
    }

    return loaded;
  }

  async updateBeverage(
    id: number,
    data: UpdateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    const existing = await this.beverageInventoryRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

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
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
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
      select: this.beverageReadSelect,
    });

    if (!beverage) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

    await this.beverageInventoryRepository.remove(beverage);
    return beverage;
  }

  findLowStockBeverages(): Promise<BeverageInventoryDto[]> {
    return this.beverageInventoryRepository.find({
      where: { status: BeverageStatus.LOW_STOCK },
      select: this.beverageReadSelect,
      order: { name: 'ASC' },
    });
  }

  findBeveragesByCategory(category: string): Promise<BeverageInventoryDto[]> {
    return this.beverageInventoryRepository.find({
      where: { category },
      select: this.beverageReadSelect,
      order: { name: 'ASC' },
    });
  }
}

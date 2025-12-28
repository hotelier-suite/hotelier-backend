import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { MenuItem } from './entities';
import {
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@app/contracts/restaurant-service';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
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

  findAll(): Promise<MenuItemDto[]> {
    return this.menuItemRepository.find({
      select: this.menuItemReadSelect,
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<MenuItemDto> {
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

  async create(data: CreateMenuItemDto): Promise<MenuItemDto> {
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

  async update(id: number, data: UpdateMenuItemDto): Promise<MenuItemDto> {
    const existing = await this.menuItemRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Menu item with id ${id} not found`,
      });
    }

    await this.menuItemRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<MenuItemDto> {
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
}

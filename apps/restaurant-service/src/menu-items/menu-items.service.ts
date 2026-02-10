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

  private readonly menuItemSelect: FindOptionsSelect<MenuItem> = {
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
      select: this.menuItemSelect,
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<MenuItemDto> {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      select: this.menuItemSelect,
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
    const entity = this.menuItemRepository.create(data);
    return this.menuItemRepository.save(entity);
  }

  async update(id: number, data: UpdateMenuItemDto): Promise<MenuItemDto> {
    const existing = await this.findOne(id);
    const entity = this.menuItemRepository.create(existing);
    const merged = this.menuItemRepository.merge(entity, data);
    return this.menuItemRepository.save(merged);
  }

  async remove(id: number): Promise<MenuItemDto> {
    const item = await this.findOne(id);
    const entity = this.menuItemRepository.create(item);
    return this.menuItemRepository.remove(entity);
  }
}

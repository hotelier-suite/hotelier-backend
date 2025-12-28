import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { BeverageInventory } from './entities';
import {
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  BeverageStatus,
  FindBeverageInventoryFilterDto,
} from '@app/contracts/restaurant-service';

@Injectable()
export class BeverageInventoryService {
  constructor(
    @InjectRepository(BeverageInventory)
    private readonly beverageRepository: Repository<BeverageInventory>,
  ) {}

  private readonly beverageInventorySelect: FindOptionsSelect<BeverageInventory> =
    {
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

  findAll(
    filters: FindBeverageInventoryFilterDto,
  ): Promise<BeverageInventoryDto[]> {
    const where: FindOptionsWhere<BeverageInventory> = {};

    if (filters.lowStock) {
      where.status = BeverageStatus.LOW_STOCK;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    return this.beverageRepository.find({
      where,
      select: this.beverageInventorySelect,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageRepository.findOne({
      where: { id },
      select: this.beverageInventorySelect,
    });

    if (!beverage) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

    return beverage;
  }

  async create(data: CreateBeverageItemDto): Promise<BeverageInventoryDto> {
    return this.beverageRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    const existing = await this.beverageRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

    const merged = this.beverageRepository.merge(existing, data);
    return this.beverageRepository.save(merged);
  }

  async remove(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageRepository.findOne({
      where: { id },
      select: this.beverageInventorySelect,
    });

    if (!beverage) {
      throw new RpcException({
        statusCode: 404,
        message: `Beverage item with id ${id} not found`,
      });
    }

    await this.beverageRepository.remove(beverage);
    return beverage;
  }
}

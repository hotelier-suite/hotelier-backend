import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { BeverageInventory } from './entities';
import {
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  BeverageStatus,
} from '@app/contracts/restaurant-service';

@Injectable()
export class BeverageInventoryService {
  constructor(
    @InjectRepository(BeverageInventory)
    private readonly beverageRepository: Repository<BeverageInventory>,
  ) {}

  private readonly readSelect: FindOptionsSelect<BeverageInventory> = {
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

  findAll(): Promise<BeverageInventoryDto[]> {
    return this.beverageRepository.find({
      select: this.readSelect,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageRepository.findOne({
      where: { id },
      select: this.readSelect,
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
    const count = await this.beverageRepository.count();
    const itemCode = `BEV${String(count + 1).padStart(3, '0')}`;

    const status =
      data.stock <= data.minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    const beverage = await this.beverageRepository.save({
      ...data,
      itemCode,
      status,
    });

    const loaded = await this.beverageRepository.findOne({
      where: { id: beverage.id },
      select: this.readSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load beverage with id ${beverage.id} after creation`,
      });
    }

    return loaded;
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

    const stock = data.stock ?? existing.stock;
    const minimumStock = data.minimumStock ?? existing.minimumStock;
    const status =
      stock <= minimumStock
        ? BeverageStatus.LOW_STOCK
        : BeverageStatus.AVAILABLE;

    await this.beverageRepository.update(id, { ...data, status });
    return this.findOne(id);
  }

  async updateStock(id: number, stock: number): Promise<BeverageInventoryDto> {
    const existing = await this.beverageRepository.findOne({ where: { id } });

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

    await this.beverageRepository.update(id, { stock, status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<BeverageInventoryDto> {
    const beverage = await this.beverageRepository.findOne({
      where: { id },
      select: this.readSelect,
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

  findLowStock(): Promise<BeverageInventoryDto[]> {
    return this.beverageRepository.find({
      where: { status: BeverageStatus.LOW_STOCK },
      select: this.readSelect,
      order: { name: 'ASC' },
    });
  }

  findByCategory(category: string): Promise<BeverageInventoryDto[]> {
    return this.beverageRepository.find({
      where: { category },
      select: this.readSelect,
      order: { name: 'ASC' },
    });
  }
}

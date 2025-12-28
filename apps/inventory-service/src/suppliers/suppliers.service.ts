import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import { Supplier } from './entities';
import {
  SupplierResponseDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '@app/contracts/inventory-service';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  private readonly supplierSelect: FindOptionsSelect<Supplier> = {
    id: true,
    name: true,
    contact: true,
    email: true,
    phone: true,
    category: true,
    rating: true,
    deliveryTime: true,
    paymentTerms: true,
    inventoryItems: {
      id: true,
    },
  };

  private readonly supplierRelations: FindOptionsRelations<Supplier> = {
    inventoryItems: true,
  };

  async findAll(): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.find({
      select: this.supplierSelect,
      relations: this.supplierRelations,
      order: { name: 'ASC' },
    });

    return suppliers.map((supplier) => {
      const { inventoryItems, ...rest } = supplier;
      return {
        ...rest,
        totalItems: inventoryItems?.length ?? 0,
      };
    });
  }

  async findOne(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      select: this.supplierSelect,
      relations: this.supplierRelations,
    });

    if (!supplier) {
      throw new RpcException({
        statusCode: 404,
        message: `Supplier with id ${id} not found`,
      });
    }

    const { inventoryItems, ...rest } = supplier;
    return {
      ...rest,
      totalItems: inventoryItems?.length ?? 0,
    };
  }

  create(data: CreateSupplierDto): Promise<SupplierResponseDto> {
    return this.supplierRepository.save(data);
  }

  async update(
    id: number,
    data: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const existing = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Supplier with id ${id} not found`,
      });
    }

    const merged = this.supplierRepository.merge(existing, data);
    return this.supplierRepository.save(merged);
  }

  async remove(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      select: this.supplierSelect,
      relations: this.supplierRelations,
    });

    if (!supplier) {
      throw new RpcException({
        statusCode: 404,
        message: `Supplier with id ${id} not found`,
      });
    }

    if (supplier.inventoryItems && supplier.inventoryItems.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message:
          'Cannot delete supplier with existing inventory items. Please reassign or remove inventory items first.',
      });
    }

    const { inventoryItems, ...rest } = supplier;
    const response: SupplierResponseDto = {
      ...rest,
      totalItems: inventoryItems?.length ?? 0,
    };

    await this.supplierRepository.remove(supplier);
    return response;
  }
}

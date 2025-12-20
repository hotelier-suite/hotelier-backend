import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierResponseDto } from '@app/contracts/inventory-service/suppliers/dto/supplier-response.dto';
import { CreateSupplierDto } from '@app/contracts/inventory-service/suppliers/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@app/contracts/inventory-service/suppliers/dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async findAll(): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.find({
      relations: { inventoryItems: true },
      order: { name: 'ASC' },
    });

    return suppliers.map((supplier) => this.toResponseDto(supplier));
  }

  async findOne(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
    });

    if (!supplier) {
      throw new RpcException({
        statusCode: 404,
        message: `Supplier with id ${id} not found`,
      });
    }

    return this.toResponseDto(supplier);
  }

  async create(data: CreateSupplierDto): Promise<SupplierResponseDto> {
    const created = await this.supplierRepository.save(data);

    return {
      id: created.id,
      name: created.name,
      contact: created.contact,
      email: created.email,
      phone: created.phone,
      category: created.category,
      rating: created.rating,
      deliveryTime: created.deliveryTime,
      paymentTerms: created.paymentTerms,
      totalItems: 0,
    };
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

    await this.supplierRepository.update(id, data);

    return this.findOne(id);
  }

  async remove(id: number): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
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

    const response = this.toResponseDto(supplier);
    await this.supplierRepository.remove(supplier);

    return response;
  }

  private toResponseDto(supplier: Supplier): SupplierResponseDto {
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
      totalItems: supplier.inventoryItems?.length ?? 0,
    };
  }
}

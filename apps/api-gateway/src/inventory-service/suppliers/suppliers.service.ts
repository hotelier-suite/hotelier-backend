import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INVENTORY_SERVICE_CLIENT } from '../constants';
import {
  SUPPLIERS_PATTERNS,
  SupplierResponseDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '@app/contracts/inventory-service';

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(INVENTORY_SERVICE_CLIENT)
    private readonly inventoryClient: ClientProxy,
  ) {}

  findAll(): Observable<SupplierResponseDto[]> {
    return this.inventoryClient.send<
      SupplierResponseDto[],
      Record<string, never>
    >(SUPPLIERS_PATTERNS.GET_ALL, {});
  }

  findOne(id: number): Observable<SupplierResponseDto> {
    return this.inventoryClient.send<SupplierResponseDto, number>(
      SUPPLIERS_PATTERNS.GET_BY_ID,
      id,
    );
  }

  create(data: CreateSupplierDto): Observable<SupplierResponseDto> {
    return this.inventoryClient.send<SupplierResponseDto, CreateSupplierDto>(
      SUPPLIERS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateSupplierDto): Observable<SupplierResponseDto> {
    return this.inventoryClient.send<
      SupplierResponseDto,
      { id: number; data: UpdateSupplierDto }
    >(SUPPLIERS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<SupplierResponseDto> {
    return this.inventoryClient.send<SupplierResponseDto, number>(
      SUPPLIERS_PATTERNS.DELETE,
      id,
    );
  }
}

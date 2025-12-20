import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SUPPLIERS_PATTERNS } from '@app/contracts/inventory-service/suppliers/suppliers.patterns';
import { CreateSupplierDto } from '@app/contracts/inventory-service/suppliers/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@app/contracts/inventory-service/suppliers/dto/update-supplier.dto';
import { SupplierResponseDto } from '@app/contracts/inventory-service/suppliers/dto/supplier-response.dto';
import { SuppliersService } from './suppliers.service';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @MessagePattern(SUPPLIERS_PATTERNS.GET_ALL)
  findAll(): Promise<SupplierResponseDto[]> {
    return this.suppliersService.findAll();
  }

  @MessagePattern(SUPPLIERS_PATTERNS.GET_BY_ID)
  findOne(@Payload() id: number): Promise<SupplierResponseDto> {
    return this.suppliersService.findOne(id);
  }

  @MessagePattern(SUPPLIERS_PATTERNS.CREATE)
  create(@Payload() data: CreateSupplierDto): Promise<SupplierResponseDto> {
    return this.suppliersService.create(data);
  }

  @MessagePattern(SUPPLIERS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateSupplierDto },
  ): Promise<SupplierResponseDto> {
    return this.suppliersService.update(payload.id, payload.data);
  }

  @MessagePattern(SUPPLIERS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<SupplierResponseDto> {
    return this.suppliersService.remove(id);
  }
}

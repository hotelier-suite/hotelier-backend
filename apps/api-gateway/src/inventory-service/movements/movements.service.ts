import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INVENTORY_SERVICE_CLIENT } from '../constants';
import {
  INVENTORY_MOVEMENTS_PATTERNS,
  InventoryMovementDto,
  CreateInventoryMovementDto,
} from '@app/contracts/inventory-service';

@Injectable()
export class MovementsService {
  constructor(
    @Inject(INVENTORY_SERVICE_CLIENT)
    private readonly inventoryClient: ClientProxy,
  ) {}

  findAll(): Observable<InventoryMovementDto[]> {
    return this.inventoryClient.send<
      InventoryMovementDto[],
      Record<string, never>
    >(INVENTORY_MOVEMENTS_PATTERNS.FIND_ALL, {});
  }

  create(data: CreateInventoryMovementDto): Observable<InventoryMovementDto> {
    return this.inventoryClient.send<
      InventoryMovementDto,
      CreateInventoryMovementDto
    >(INVENTORY_MOVEMENTS_PATTERNS.CREATE, data);
  }
}

import { OmitType } from '@nestjs/swagger';
import { InventoryMovement } from '../entities/inventory-movement.entity';

export class CreateInventoryMovementDto extends OmitType(InventoryMovement, [
  'id',
  'previousStock',
  'newStock',
  'createdAt',
  'updatedAt',
  'inventory',
]) {}

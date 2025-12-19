import { OmitType } from '@nestjs/swagger';
import { Inventory } from '../entities/inventory.entity';

export class CreateInventoryItemDto extends OmitType(Inventory, [
  'id',
  'status',
  'createdAt',
  'updatedAt',
  'movements',
]) {}

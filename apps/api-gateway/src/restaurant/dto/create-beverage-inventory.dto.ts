import { OmitType } from '@nestjs/swagger';
import { BeverageInventory } from '../entities/beverage-inventory.entity';

export class CreateBeverageInventoryDto extends OmitType(BeverageInventory, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

import { OmitType } from '@nestjs/swagger';
import { BeverageInventory } from '../entities/beverage-inventory.entity';

export class CreateBeverageItemDto extends OmitType(BeverageInventory, [
  'id',
  'itemCode',
  'lastPurchase',
  'status',
  'createdAt',
  'updatedAt',
]) {}

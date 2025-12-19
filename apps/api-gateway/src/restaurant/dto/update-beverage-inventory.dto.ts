import { PartialType } from '@nestjs/swagger';
import { CreateBeverageInventoryDto } from './create-beverage-inventory.dto';

export class UpdateBeverageInventoryDto extends PartialType(
  CreateBeverageInventoryDto,
) {}

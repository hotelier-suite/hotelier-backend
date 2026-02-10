import { PartialType } from '@nestjs/swagger';
import { CreateBeverageItemDto } from './create-beverage-item.dto';

export class UpdateBeverageItemDto extends PartialType(CreateBeverageItemDto) {}

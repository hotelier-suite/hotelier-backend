import { OmitType } from '@nestjs/swagger';
import { MenuItem } from '../entities/menu-item.entity';

export class CreateMenuItemDto extends OmitType(MenuItem, [
  'id',
  'itemCode',
  'available',
  'createdAt',
  'updatedAt',
]) {}

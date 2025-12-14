import { OmitType } from '@nestjs/swagger';
import { Staff } from '../entities/staff.entity';

export class CreateStaffDto extends OmitType(Staff, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

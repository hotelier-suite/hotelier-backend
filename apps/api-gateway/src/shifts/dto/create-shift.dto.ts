import { OmitType } from '@nestjs/swagger';
import { Shift } from '../entities/shift.entity';

export class CreateShiftDto extends OmitType(Shift, [
  'id',
  'createdAt',
  'updatedAt',
  'employee',
]) {}

import { OmitType } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class CreateEmployeeDto extends OmitType(Employee, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

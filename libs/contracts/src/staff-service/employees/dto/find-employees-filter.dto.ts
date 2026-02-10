import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from '../enums/department.enum';

export class FindEmployeesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter employees by department',
    enum: Department,
    example: Department.HOUSEKEEPING,
  })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;
}

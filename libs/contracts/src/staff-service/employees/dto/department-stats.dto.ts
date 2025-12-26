import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { Department } from '..';

export class DepartmentStatsDto {
  @ApiProperty({
    description: 'Department name',
    enum: Department,
    example: Department.HOUSEKEEPING,
  })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({
    description: 'Number of active employees in department',
    example: 8,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  activeCount: number;

  @ApiProperty({
    description: 'Total number of employees in department',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  totalCount: number;
}

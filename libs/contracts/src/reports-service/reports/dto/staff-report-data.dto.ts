import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class StaffReportDataDto {
  @ApiProperty({ description: 'Total number of employees', example: 50 })
  @IsInt()
  @Min(0)
  totalEmployees: number;

  @ApiProperty({ description: 'Number of active employees', example: 45 })
  @IsInt()
  @Min(0)
  activeEmployees: number;

  @ApiProperty({ description: 'Number of employees on leave', example: 3 })
  @IsInt()
  @Min(0)
  onLeave: number;

  @ApiProperty({
    description: 'Average attendance rate percentage',
    example: 95.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceRate: number;

  @ApiProperty({ description: 'Total overtime hours', example: 120.5 })
  @IsNumber()
  @Min(0)
  overtimeHours: number;

  @ApiProperty({ description: 'Total labor cost', example: 75000.0 })
  @IsNumber()
  @Min(0)
  laborCost: number;

  @ApiProperty({
    description: 'Average hours worked per employee',
    example: 40.5,
  })
  @IsNumber()
  @Min(0)
  averageHoursWorked: number;
}

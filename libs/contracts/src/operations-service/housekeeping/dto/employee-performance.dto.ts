import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class EmployeePerformanceDto {
  @ApiProperty({ description: 'Employee ID', example: 1 })
  @IsNumber()
  employeeId: number;

  @ApiProperty({ description: 'Number of completed assignments', example: 25 })
  @IsNumber()
  completedAssignments: number;

  @ApiProperty({ description: 'Average quality score for this employee', example: 9.2 })
  @IsNumber()
  averageQualityScore: number;
}

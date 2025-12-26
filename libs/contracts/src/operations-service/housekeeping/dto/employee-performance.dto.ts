import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class EmployeePerformanceDto {
  @ApiProperty({ description: 'Employee ID', example: 1 })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({ description: 'Number of completed assignments', example: 25 })
  @IsInt()
  @Min(0)
  completedAssignments: number;

  @ApiProperty({
    description: 'Average quality score for this employee',
    example: 9.2,
  })
  @IsNumber()
  @Min(0)
  averageQualityScore: number;
}

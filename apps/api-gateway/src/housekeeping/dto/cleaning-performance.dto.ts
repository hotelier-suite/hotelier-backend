import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { EmployeePerformanceDto } from './employee-performance.dto';

export class CleaningPerformanceDto {
  @ApiProperty({
    description: 'Overall average quality score',
    example: 8.7,
  })
  @IsNumber()
  averageQualityScore: number;

  @ApiProperty({
    description: 'Completion rate as a percentage',
    example: 92.5,
  })
  @IsNumber()
  completionRate: number;

  @ApiProperty({
    description: 'Performance data for individual employees',
    type: [EmployeePerformanceDto],
  })
  @IsArray()
  employeePerformance: EmployeePerformanceDto[];
}

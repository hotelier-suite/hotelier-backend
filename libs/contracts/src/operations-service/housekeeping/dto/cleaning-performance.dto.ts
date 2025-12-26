import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { EmployeePerformanceDto } from './employee-performance.dto';

export class CleaningPerformanceDto {
  @ApiProperty({ description: 'Overall average quality score', example: 8.7 })
  @IsNumber()
  @Min(0)
  averageQualityScore: number;

  @ApiProperty({
    description: 'Completion rate as a percentage',
    example: 92.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate: number;

  @ApiProperty({
    description: 'Performance data for individual employees',
    type: [EmployeePerformanceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmployeePerformanceDto)
  employeePerformance: EmployeePerformanceDto[];
}

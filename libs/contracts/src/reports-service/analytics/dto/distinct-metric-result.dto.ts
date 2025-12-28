import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class DistinctMetricResultDto {
  @ApiProperty({
    description: 'Analytics metric type',
    example: 'OCCUPANCY_RATE',
  })
  @IsString()
  metric: string;

  @ApiProperty({
    description: 'Metric value as string',
    example: '85.5',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Date of the metric',
    example: '2024-01-15T00:00:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class DailyRevenueDto {
  @ApiProperty({
    description: 'Date',
    type: String,
    example: '2024-01-15',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Revenue amount', example: 1250.75 })
  @IsNumber()
  @Min(0)
  revenue: number;
}

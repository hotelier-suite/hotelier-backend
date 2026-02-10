import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class RevenueDataDto {
  @ApiProperty({
    description: 'Date',
    type: String,
    example: '2024-01-15',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Revenue amount for the date',
    example: 5420.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue: number;
}

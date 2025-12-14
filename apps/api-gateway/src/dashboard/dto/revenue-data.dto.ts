import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class RevenueDataDto {
  @ApiProperty({
    description: 'Date in YYYY-MM-DD format',
    example: '2024-01-15',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Revenue amount for the date',
    example: 5420.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, Min, Max } from 'class-validator';

export class OccupancyDataDto {
  @ApiProperty({
    description: 'Date',
    type: String,
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Occupancy percentage',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  occupancy: number;
}

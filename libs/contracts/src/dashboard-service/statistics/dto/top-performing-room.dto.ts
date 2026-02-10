import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class TopPerformingRoomDto {
  @ApiProperty({
    description: 'Room number',
    example: '101',
  })
  @IsString()
  room: string;

  @ApiProperty({
    description: 'Room revenue',
    example: 2500.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue: number;

  @ApiProperty({
    description: 'Room occupancy percentage',
    example: 95,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  occupancy: number;
}

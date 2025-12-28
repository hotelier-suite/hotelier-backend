import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { RoomType } from '../../rooms';

export class GetAvailabilityDto {
  @ApiProperty({
    description: 'Start date for the availability search',
    example: '2025-09-20',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date for the availability search',
    example: '2025-09-23',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Filter by room type',
    required: false,
    enum: RoomType,
    example: RoomType.DOBLE,
  })
  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;

  @ApiProperty({
    description: 'Minimum number of guests the room must accommodate',
    required: false,
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  guests?: number;
}

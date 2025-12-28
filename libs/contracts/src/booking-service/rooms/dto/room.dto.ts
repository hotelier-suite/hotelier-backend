import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { RoomType } from '..';

export class RoomDto {
  @ApiProperty({ description: 'Unique identifier for the room', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Room number or code for identification',
    example: '201',
  })
  @IsString()
  @Length(1, 10)
  number: string;

  @ApiProperty({
    description: 'Type of room accommodation',
    enum: RoomType,
    example: RoomType.DOBLE,
  })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({
    description: 'Room rate per night in USD',
    example: 75.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Maximum number of guests the room can accommodate',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Whether the room is currently available for booking',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Detailed description of the room and its amenities',
    required: false,
    example: 'Spacious double room with amenities',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;

  @ApiProperty({
    description: 'Timestamp when the room record was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the room record was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

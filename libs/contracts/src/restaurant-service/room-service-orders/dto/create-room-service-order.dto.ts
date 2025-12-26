import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { RoomServiceOrderItemDto } from './room-service-order-item.dto';

export class CreateRoomServiceOrderDto {
  @ApiProperty({
    description: 'Room number',
    example: '201',
  })
  @IsString()
  @Length(1, 10)
  @Transform(({ value }) => value?.trim())
  room: string;

  @ApiProperty({
    description: 'Guest name',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  guest: string;

  @ApiProperty({
    description: 'List of ordered items',
    type: [RoomServiceOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomServiceOrderItemDto)
  items: RoomServiceOrderItemDto[];

  @ApiProperty({
    description: 'Total amount of the order',
    example: 33.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Estimated delivery time',
    example: '25 minutes',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  estimatedTime?: string;

  @ApiProperty({
    description: 'Assigned waiter',
    example: 'Sarah Davis',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  waiter?: string;

  @ApiProperty({
    description: 'Special instructions for the order',
    example: 'Guest has nut allergy',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  specialInstructions?: string;

  @ApiProperty({
    description: 'Guest ID (optional - for linking orders to hotel guests)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestId?: number;
}

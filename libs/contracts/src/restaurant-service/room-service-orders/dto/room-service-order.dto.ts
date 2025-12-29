import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { RoomServiceStatus } from '..';
import { RoomServiceOrderItemDto } from './room-service-order-item.dto';

export class RoomServiceOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the room service order',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique order number',
    example: 'RS-2024-001',
  })
  @IsString()
  @Length(1, 50)
  orderNumber: string;

  @ApiProperty({
    description: 'Room number',
    example: '201',
  })
  @IsString()
  @Length(1, 10)
  room: string;

  @ApiProperty({
    description: 'Guest name',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
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
    description: 'Date and time when the order was placed',
    example: '2024-01-15T14:30:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  orderDate: Date;

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
    description: 'Current status of the order',
    enum: RoomServiceStatus,
    example: RoomServiceStatus.PENDING,
  })
  @IsEnum(RoomServiceStatus)
  status: RoomServiceStatus;

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

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

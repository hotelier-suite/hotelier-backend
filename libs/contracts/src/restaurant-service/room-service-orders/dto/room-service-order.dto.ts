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
} from 'class-validator';
import { RoomServiceStatus } from '..';

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
    example: [{ item: 'Club Sandwich', quantity: 1, price: 18.5 }],
  })
  @IsArray()
  items: any[];

  @ApiProperty({
    description: 'Total amount of the order',
    example: 33.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Time when the order was placed',
    example: '14:30',
  })
  @IsString()
  @Length(1, 10)
  orderTime: string;

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
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '..';

export class NotificationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ enum: NotificationType, example: NotificationType.INFO })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Inventory out of stock' })
  @IsString()
  title: string;

  @ApiProperty({ example: "Inventory item 'Water' is out of stock" })
  @IsString()
  message: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  refId?: number;

  @ApiProperty({ required: false, example: 'inventory' })
  @IsOptional()
  @IsString()
  refType?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({ required: false, nullable: true, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

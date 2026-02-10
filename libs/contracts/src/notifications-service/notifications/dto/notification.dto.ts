import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { NotificationType } from '../enums';

export class NotificationDto {
  @ApiProperty({
    description: 'Unique identifier for the notification',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Type of notification indicating its severity level',
    enum: NotificationType,
    example: NotificationType.INFO,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Brief title summarizing the notification',
    example: 'Inventory out of stock',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed message content of the notification',
    example: "Inventory item 'Water' is out of stock",
  })
  @IsString()
  message: string;

  @ApiProperty({
    description:
      'ID of the related entity this notification refers to (e.g., inventory item ID)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  refId?: number;

  @ApiProperty({
    description:
      'Type of the related entity this notification refers to (e.g., inventory, reservation)',
    required: false,
    example: 'inventory',
  })
  @IsOptional()
  @IsString()
  refType?: string;

  @ApiProperty({
    description: 'Whether the notification has been read by the user',
    example: false,
  })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description:
      'ID of the user this notification is addressed to (null for broadcast notifications)',
    required: false,
    nullable: true,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;

  @ApiProperty({
    description: 'Timestamp when the notification was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}

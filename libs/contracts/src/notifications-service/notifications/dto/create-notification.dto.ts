import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { NotificationType } from '..';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of notification indicating its severity level',
    required: false,
    enum: NotificationType,
    example: NotificationType.INFO,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({
    description: 'Brief title summarizing the notification (1-150 characters)',
    example: 'Inventory out of stock',
  })
  @IsString()
  @Length(1, 150)
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
  @Length(1, 50)
  refType?: string;

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
}

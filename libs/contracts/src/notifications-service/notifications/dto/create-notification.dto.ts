import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
  @ApiProperty({
    required: false,
    enum: NotificationType,
    example: NotificationType.INFO,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ example: 'Inventory out of stock' })
  @IsString()
  @Length(1, 150)
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
  @Length(1, 50)
  refType?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 1,
    description:
      'User ID to whom the notification is addressed (null = broadcast)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification-type.enum';

export class NotificationDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: NotificationType, example: NotificationType.INFO })
  type: NotificationType;

  @ApiProperty({ example: 'Inventory out of stock' })
  title: string;

  @ApiProperty({ example: "Inventory item 'Water' is out of stock" })
  message: string;

  @ApiProperty({ required: false, example: 1 })
  refId?: number;

  @ApiProperty({ required: false, example: 'inventory' })
  refType?: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ required: false, nullable: true, example: 1 })
  userId?: number | null;

  @ApiProperty({ type: String })
  createdAt: Date;
}

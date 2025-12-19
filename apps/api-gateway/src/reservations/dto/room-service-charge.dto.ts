import { ApiProperty } from '@nestjs/swagger';

export class RoomServiceChargeDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  orderId: number;

  @ApiProperty({ description: 'Order number', example: 'RS-2024-001' })
  orderNumber: string;

  @ApiProperty({ description: 'Order time', example: '14:30' })
  orderTime: string;

  @ApiProperty({ description: 'Order total', example: 33.5 })
  total: number;

  @ApiProperty({ description: 'Order status', example: 'delivered' })
  status: string;

  @ApiProperty({ description: 'Items in the order', example: [] })
  items: any[];
}

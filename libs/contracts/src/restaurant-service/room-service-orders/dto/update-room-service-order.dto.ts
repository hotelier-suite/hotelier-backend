import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateRoomServiceOrderDto } from './create-room-service-order.dto';
import { RoomServiceStatus } from '../enums';

export class UpdateRoomServiceOrderDto extends PartialType(
  CreateRoomServiceOrderDto,
) {
  @ApiProperty({
    description: 'Current status of the order',
    enum: RoomServiceStatus,
    example: RoomServiceStatus.PREPARING,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoomServiceStatus)
  status?: RoomServiceStatus;
}

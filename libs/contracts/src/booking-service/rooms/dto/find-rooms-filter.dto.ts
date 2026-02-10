import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType } from '../enums';

export class FindRoomsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter rooms by type',
    enum: RoomType,
    example: RoomType.DOBLE,
  })
  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;

  @ApiPropertyOptional({
    description: 'Filter rooms by availability status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

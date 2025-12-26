import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { RoomType } from '../../rooms';

export class GetAvailabilityDto {
  @ApiProperty({ example: '2025-09-20' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-09-23' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, enum: RoomType, example: RoomType.DOBLE })
  @IsOptional()
  @IsEnum(RoomType)
  type?: RoomType;

  @ApiProperty({ required: false, example: 2, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  guests?: number;
}

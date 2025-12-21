import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';

export class CreateRoomDto {
  @ApiProperty({ example: '201' })
  @IsString()
  @Length(1, 10)
  number: string;

  @ApiProperty({ enum: RoomType, example: RoomType.DOBLE })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ example: 75.0, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    required: false,
    example: 'Spacious double room with amenities',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Length, Min } from 'class-validator';

export class RoomServiceOrderItemDto {
  @ApiProperty({
    description: 'Name of the ordered item',
    example: 'Club Sandwich',
  })
  @IsString()
  @Length(1, 100)
  item: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Price per item',
    example: 18.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}

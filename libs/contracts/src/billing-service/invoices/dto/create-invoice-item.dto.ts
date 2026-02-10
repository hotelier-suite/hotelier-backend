import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({
    description: 'Item description',
    example: 'Room accommodation (3 nights)',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Item quantity',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: 75.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Total amount (quantity × price)',
    example: 225.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;
}

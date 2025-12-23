import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString, Length, Min } from 'class-validator';

export class InvoiceItemDto {
  @ApiProperty({
    description: 'Invoice item unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

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

  @ApiProperty({
    description: 'Associated invoice ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  invoiceId: number;
}

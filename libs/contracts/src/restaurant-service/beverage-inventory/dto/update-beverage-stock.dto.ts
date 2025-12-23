import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateBeverageStockDto {
  @ApiProperty({
    description: 'New stock quantity',
    example: 30,
  })
  @IsInt()
  @Min(0)
  stock: number;
}

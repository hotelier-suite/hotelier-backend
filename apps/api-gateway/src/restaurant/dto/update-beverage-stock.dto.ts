import { IsNumber } from 'class-validator';

export class UpdateBeverageStockDto {
  @IsNumber()
  stock: number;
}

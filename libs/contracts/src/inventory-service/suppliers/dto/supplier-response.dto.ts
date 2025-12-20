import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SupplierResponseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Linen Supply Co' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({ required: false, example: 'contact@linensupply.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '+1-555-0123' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'General' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 4.0, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ required: false, example: '3-5 days' })
  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @ApiProperty({ required: false, example: '30 days' })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({ required: false, example: 5, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalItems?: number;
}

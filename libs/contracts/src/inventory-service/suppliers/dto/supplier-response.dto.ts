import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the supplier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Name of the supplier company',
    example: 'Linen Supply Co',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Primary contact person at the supplier',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'Email address of the supplier',
    required: false,
    example: 'contact@linensupply.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    required: false,
    example: '+1-555-0123',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Category of products supplied',
    required: false,
    example: 'General',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Supplier rating (0-5 scale)',
    required: false,
    example: 4.0,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({
    description: 'Typical delivery time for orders',
    required: false,
    example: '3-5 days',
  })
  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @ApiProperty({
    description: 'Payment terms offered by the supplier',
    required: false,
    example: '30 days',
  })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({
    description: 'Total number of items supplied',
    required: false,
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalItems?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the supplier',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Supplier name',
    example: 'Linen Supply Co',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Supplier contact person',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'Supplier email address',
    example: 'contact@linensupply.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Supplier phone number',
    example: '+1-555-0123',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Supplier category',
    example: 'General',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Supplier rating (0-5)',
    example: 4.0,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({
    description: 'Delivery time',
    example: '3-5 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @ApiProperty({
    description: 'Payment terms',
    example: '30 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({
    description: 'Number of items supplied',
    example: 5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalItems?: number;
}

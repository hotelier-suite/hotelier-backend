import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Supplier name',
    example: 'Linen Supply Co',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Contact person name',
    example: 'John Doe',
  })
  @IsString()
  @Length(1, 100)
  contact: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1-555-0123',
  })
  @IsString()
  @Length(1, 20)
  phone: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contact@linensupply.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Supply Street, City, State 12345',
  })
  @IsString()
  @Length(1, 200)
  address: string;

  @ApiProperty({
    description: 'Supplier category',
    example: 'Textiles',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @ApiProperty({
    description: 'Supplier rating (0-5)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}

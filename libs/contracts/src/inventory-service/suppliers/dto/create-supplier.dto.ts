import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Linen Supply Co' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(1, 100)
  contact: string;

  @ApiProperty({ example: '+1-555-0123' })
  @IsString()
  @Length(1, 20)
  phone: string;

  @ApiProperty({ example: 'contact@linensupply.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123 Supply Street, City, State 12345' })
  @IsString()
  @Length(1, 200)
  address: string;

  @ApiProperty({ required: false, example: 'Textiles' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @ApiProperty({ required: false, example: 4.5, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;
}

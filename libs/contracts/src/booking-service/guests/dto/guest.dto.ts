import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GuestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'ABC123456' })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ required: false, example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'American' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date',
    example: '1985-05-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({ required: false, example: 'Non-smoking room, high floor' })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  vip: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

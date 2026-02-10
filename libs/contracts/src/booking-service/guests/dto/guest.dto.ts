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
  @ApiProperty({
    description: 'Unique identifier for the guest',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Full name of the guest',
    example: 'John Smith',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the guest for communication',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the guest for contact purposes',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Identification document number (passport, ID card, etc.)',
    required: false,
    example: 'ABC123456',
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'Residential address of the guest',
    required: false,
    example: '123 Main St, New York, NY',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Nationality of the guest',
    required: false,
    example: 'American',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    description: 'Date of birth of the guest',
    required: false,
    type: String,
    format: 'date',
    example: '1985-05-15',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @ApiProperty({
    description: 'Special preferences or requests from the guest',
    required: false,
    example: 'Non-smoking room, high floor',
  })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({
    description: 'Whether the guest has VIP status',
    example: false,
  })
  @IsBoolean()
  vip: boolean;

  @ApiProperty({
    description: 'Timestamp when the guest record was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the guest record was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

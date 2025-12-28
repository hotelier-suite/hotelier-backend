import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ description: 'Full name of the guest', example: 'John Smith' })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Email address of the guest',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Phone number of the guest',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Identity document number (passport, ID card, etc.)',
    required: false,
    example: 'ABC123456',
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    description: 'Home address of the guest',
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
  @IsDate()
  birthDate?: Date;

  @ApiProperty({
    description: 'Guest preferences and special requests',
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
}

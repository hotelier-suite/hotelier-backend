import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LoyaltyLevel } from '../enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (unique)',
    example: 'admin@hotelier.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123!',
  })
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'System Administrator',
  })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  name!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'User loyalty points accumulated',
    example: 0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  loyaltyPoints?: number;

  @ApiProperty({
    description: 'User loyalty level',
    enum: LoyaltyLevel,
    example: LoyaltyLevel.BRONZE,
    required: false,
  })
  @IsOptional()
  @IsEnum(LoyaltyLevel)
  loyaltyLevel?: LoyaltyLevel;

  @ApiProperty({
    description: 'User preferences in JSON format',
    example: '{"theme":"dark"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

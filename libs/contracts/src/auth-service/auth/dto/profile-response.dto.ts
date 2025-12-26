import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';
import { LoyaltyLevel } from '../../users';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@hotelier.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'System Administrator',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'User loyalty points accumulated',
    example: 1250,
    minimum: 0,
  })
  @IsNumber()
  loyaltyPoints: number;

  @ApiProperty({
    description: 'User loyalty level',
    enum: LoyaltyLevel,
    example: LoyaltyLevel.PLATINUM,
  })
  @IsEnum(LoyaltyLevel)
  loyaltyLevel: LoyaltyLevel;

  @ApiProperty({
    description: 'User registration date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  registrationDate: Date;

  @ApiProperty({
    description: 'User roles',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'admin' },
        description: {
          type: 'string',
          example: 'System Administrator - Full access',
        },
      },
    },
  })
  @IsArray()
  roles: Array<{
    id: number;
    name: string;
    description?: string;
  }>;

  @ApiProperty({
    description: 'User permissions',
    type: 'array',
    items: { type: 'string' },
    example: ['users:create', 'users:read', 'users:update', 'users:delete'],
  })
  @IsArray()
  permissions: string[];
}

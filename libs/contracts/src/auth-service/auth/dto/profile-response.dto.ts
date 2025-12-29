import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
  IsEmail,
  Min,
  ValidateNested,
} from 'class-validator';
import { LoyaltyLevel, UserRoleDto } from '../../users';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@hotelier.com',
  })
  @IsEmail()
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
  @IsInt()
  @Min(0)
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
  @Type(() => Date)
  @IsDate()
  registrationDate: Date;

  @ApiProperty({
    description: 'User roles',
    type: [UserRoleDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  roles: UserRoleDto[];

  @ApiProperty({
    description: 'User permissions',
    type: 'array',
    items: { type: 'string' },
    example: ['users:create', 'users:read', 'users:update', 'users:delete'],
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

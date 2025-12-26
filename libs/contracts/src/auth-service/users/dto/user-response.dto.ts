import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { LoyaltyLevel } from '..';
import { UserRoleAssignmentDto } from './user-role-assignment.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@hotelier.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'System Administrator',
  })
  @IsString()
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
    example: 1250,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  loyaltyPoints!: number;

  @ApiProperty({
    description: 'User loyalty level',
    enum: LoyaltyLevel,
    example: LoyaltyLevel.PLATINUM,
  })
  @IsEnum(LoyaltyLevel)
  loyaltyLevel!: LoyaltyLevel;

  @ApiProperty({
    description: 'User preferences in JSON format',
    example: '{"theme": "dark", "language": "en"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({
    description: 'User registration date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  registrationDate!: Date;

  @ApiProperty({
    description: 'Last visit timestamp',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastVisit?: Date;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Last account update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    description: 'First visit timestamp',
    example: '2024-01-02T09:15:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  firstVisit?: Date;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;

  @ApiProperty({
    description: 'User role assignments (join table)',
    required: false,
    type: () => UserRoleAssignmentDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleAssignmentDto)
  userRoles?: UserRoleAssignmentDto[];

  @ApiProperty({
    description: 'User permissions',
    type: 'array',
    items: { type: 'string' },
    example: ['users:create', 'users:read', 'users:update', 'users:delete'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

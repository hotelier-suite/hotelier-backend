import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address (unique)',
    example: 'john.doe@hotelier.com',
  })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/.*[A-Z].*/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/.*[a-z].*/, {
    message: 'password must contain at least one lowercase letter',
  })
  @Matches(/.*\d.*/, {
    message: 'password must contain at least one number',
  })
  @Matches(/.*[^A-Za-z0-9].*/, {
    message: 'password must contain at least one special character',
  })
  password!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
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
    description: 'Role ID to assign to user',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  roleId?: number;
}

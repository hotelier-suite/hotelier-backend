import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { RolePermissionResponseDto } from './role-permission-response.dto';

export class RoleResponseDto {
  @ApiProperty({
    description: 'Role unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({
    description: 'Role name (unique)',
    example: 'admin',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Role description',
    example: 'System Administrator - Full access',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether this is a system-defined role',
    example: true,
  })
  @IsBoolean()
  isSystem!: boolean;

  @ApiProperty({
    description: 'Role creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Role last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    description: 'Role permissions',
    type: () => RolePermissionResponseDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionResponseDto)
  permissions!: RolePermissionResponseDto[];
}

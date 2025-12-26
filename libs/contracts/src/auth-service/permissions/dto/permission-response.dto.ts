import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PermissionResponseDto {
  @ApiProperty({
    description: 'Permission unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({
    description: 'Resource that this permission applies to',
    example: 'users',
  })
  @IsString()
  resource!: string;

  @ApiProperty({
    description: 'Action that can be performed on the resource',
    example: 'create',
  })
  @IsString()
  action!: string;

  @ApiProperty({
    description: 'Human-readable description of the permission',
    example: 'Create users',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is currently active',
    example: true,
  })
  @IsBoolean()
  active!: boolean;

  @ApiProperty({
    description: 'Permission creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    description: 'Permission last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Updated resource that this permission applies to',
    example: 'users',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  resource?: string;

  @ApiProperty({
    description: 'Updated action that can be performed on the resource',
    example: 'create',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  action?: string;

  @ApiProperty({
    description: 'Updated human-readable description of the permission',
    example: 'Create users',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

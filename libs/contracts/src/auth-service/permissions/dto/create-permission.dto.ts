import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Resource that this permission applies to',
    example: 'users',
  })
  @IsString()
  @Length(1, 100)
  resource!: string;

  @ApiProperty({
    description: 'Action that can be performed on the resource',
    example: 'create',
  })
  @IsString()
  @Length(1, 100)
  action!: string;

  @ApiProperty({
    description: 'Human-readable description of the permission',
    example: 'Create users',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

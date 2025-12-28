import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Updated role name (unique)',
    example: 'manager',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @ApiProperty({
    description: 'Updated role description',
    example: 'Hotel Manager - Limited administrative access',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiProperty({
    description:
      'Permission IDs to assign to the role (replaces existing permissions)',
    type: 'array',
    items: { type: 'number' },
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  permissionIds?: number[];
}

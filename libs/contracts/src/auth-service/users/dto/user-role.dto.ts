import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({ description: 'Role ID', example: 1 })
  @IsInt()
  @Min(1)
  id!: number;

  @ApiProperty({ description: 'Role name', example: 'admin' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

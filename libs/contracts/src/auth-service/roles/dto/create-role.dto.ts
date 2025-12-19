import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (unique)',
    example: 'admin',
  })
  @IsString()
  @Length(1, 50)
  name!: string;

  @ApiProperty({
    description: 'Role description',
    example: 'System Administrator - Full access',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

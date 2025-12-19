import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

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
}

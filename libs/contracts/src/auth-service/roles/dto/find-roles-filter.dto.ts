import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindRolesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter roles by name (partial match)',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindPermissionsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter permissions by resource name',
    example: 'RESERVATION',
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiPropertyOptional({
    description: 'Filter permissions by action',
    example: 'READ',
  })
  @IsOptional()
  @IsString()
  action?: string;
}

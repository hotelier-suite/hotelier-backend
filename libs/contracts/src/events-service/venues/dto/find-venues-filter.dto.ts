import { IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class FindVenuesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter to show only available venues',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Filter venues with at least this capacity',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  minCapacity?: number;

  @ApiPropertyOptional({
    description: 'Filter venues by name (partial match)',
    example: 'Ballroom',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

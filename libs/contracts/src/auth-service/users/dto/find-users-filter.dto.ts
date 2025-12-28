import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class FindUsersFilterDto {
  @ApiPropertyOptional({
    description: 'Filter users by email (partial match)',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter users by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter users by role ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId?: number;
}

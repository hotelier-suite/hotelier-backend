import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SpaceType } from '../enums/space-type.enum';
import { SpaceStatus } from '../enums/space-status.enum';

export class FindSpacesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter spaces by status',
    enum: SpaceStatus,
    example: SpaceStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(SpaceStatus)
  status?: SpaceStatus;

  @ApiPropertyOptional({
    description: 'Filter spaces by their designated type',
    enum: SpaceType,
    example: SpaceType.GUEST,
  })
  @IsOptional()
  @IsEnum(SpaceType)
  type?: SpaceType;

  @ApiPropertyOptional({
    description: 'Filter spaces by zone identifier (e.g., A, B, C)',
    example: 'A',
  })
  @IsOptional()
  @IsString()
  zone?: string;

  @ApiPropertyOptional({
    description: 'Filter spaces by code (exact match)',
    example: 'A-101',
  })
  @IsOptional()
  @IsString()
  code?: string;
}

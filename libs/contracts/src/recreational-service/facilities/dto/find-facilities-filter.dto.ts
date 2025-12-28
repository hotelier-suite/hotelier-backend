import { IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FacilityType, FacilityStatus } from '../enums';

export class FindFacilitiesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by facility status',
    enum: FacilityStatus,
    example: FacilityStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(FacilityStatus)
  status?: FacilityStatus;

  @ApiPropertyOptional({
    description:
      'Filter by availability flag (whether facility accepts bookings)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by facility type',
    enum: FacilityType,
    example: FacilityType.GYM,
  })
  @IsOptional()
  @IsEnum(FacilityType)
  type?: FacilityType;
}

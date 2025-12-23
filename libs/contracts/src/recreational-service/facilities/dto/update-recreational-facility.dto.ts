import { PartialType } from '@nestjs/swagger';
import { CreateRecreationalFacilityDto } from './create-recreational-facility.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { FacilityStatus } from '../enums/facility-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecreationalFacilityDto extends PartialType(
  CreateRecreationalFacilityDto,
) {
  @ApiProperty({
    description: 'Current facility status',
    enum: FacilityStatus,
    example: FacilityStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FacilityStatus)
  status?: FacilityStatus;
}

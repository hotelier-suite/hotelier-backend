import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHousekeepingMaintenanceRequestDto } from './create-maintenance-request.dto';
import { HousekeepingMaintenanceStatus } from '../enums';

export class UpdateHousekeepingMaintenanceRequestDto extends PartialType(
  CreateHousekeepingMaintenanceRequestDto,
) {
  @ApiProperty({
    description: 'Current status of the maintenance request',
    enum: HousekeepingMaintenanceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HousekeepingMaintenanceStatus)
  status?: HousekeepingMaintenanceStatus;

  @ApiProperty({
    description: 'Name of the person assigned to handle the request',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTo?: string;

  @ApiProperty({
    description: 'Date when the maintenance request was resolved',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedDate?: Date;

  @ApiProperty({ description: 'Cost of the maintenance work', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Additional notes about the maintenance request',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}

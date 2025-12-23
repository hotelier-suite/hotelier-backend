import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGeneralMaintenanceRequestDto } from './create-general-maintenance-request.dto';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';

export class UpdateGeneralMaintenanceRequestDto extends PartialType(CreateGeneralMaintenanceRequestDto) {
  @ApiProperty({ description: 'Current status', enum: MaintenanceStatus, example: MaintenanceStatus.IN_PROGRESS, required: false })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiProperty({ description: 'Actual cost for maintenance', example: 175.0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  actualCost?: number;

  @ApiProperty({ description: 'Date when maintenance was started', example: '2024-12-15T09:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({ description: 'Date when maintenance was completed', example: '2024-12-15T11:30:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({ description: 'Work performed or completion notes', example: 'Replaced faulty compressor and cleaned filters.', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  workPerformed?: string;

  @ApiProperty({ description: 'Materials used during maintenance', example: 'Compressor unit, air filters, refrigerant', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  materialsUsed?: string;
}

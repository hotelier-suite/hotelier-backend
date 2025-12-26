import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  IsDateString,
  IsMilitaryTime,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenancePriority, MaintenanceType } from '..';

export class CreateGeneralMaintenanceRequestDto {
  @ApiProperty({
    description: 'Maintenance request title',
    example: 'Fix air conditioning in room 205',
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the maintenance request',
    example:
      'The air conditioning unit is not working properly and making noise.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: 'Type of maintenance',
    enum: MaintenanceType,
    example: MaintenanceType.CORRECTIVE,
  })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({
    description: 'Priority level',
    enum: MaintenancePriority,
    example: MaintenancePriority.HIGH,
  })
  @IsEnum(MaintenancePriority)
  priority: MaintenancePriority;

  @ApiProperty({
    description: 'Location where maintenance is needed',
    example: 'Room 205',
  })
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty({
    description: 'Equipment or asset requiring maintenance',
    example: 'Air Conditioning Unit',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  equipment?: string;

  @ApiProperty({
    description: 'Scheduled date for maintenance',
    example: '2024-12-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  scheduledDate?: Date;

  @ApiProperty({
    description: 'Scheduled start time',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsMilitaryTime()
  scheduledStartTime?: string;

  @ApiProperty({
    description: 'Estimated duration in hours',
    example: 2.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedDuration?: number;

  @ApiProperty({
    description: 'Estimated cost for maintenance',
    example: 150.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedCost?: number;

  @ApiProperty({
    description: 'ID of the assigned technician',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  assignedTechnicianId?: number;

  @ApiProperty({
    description: 'ID of the employee who requested maintenance',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  requestedById?: number;
}

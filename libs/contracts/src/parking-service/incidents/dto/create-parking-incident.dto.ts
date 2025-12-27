import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TaskPriority } from '@app/contracts/common';
import { IncidentType } from '..';

export class CreateParkingIncidentDto {
  @ApiProperty({
    description: 'Type of parking incident',
    enum: IncidentType,
    example: IncidentType.VEHICLE_DAMAGE,
  })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({
    description:
      'Detailed description of the parking incident (1-500 characters)',
    example: 'Vehicle scratched while parking',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description:
      'Name of the person responsible for handling the incident (1-100 characters)',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
  responsible: string;

  @ApiProperty({
    description: 'Priority level of the incident',
    required: false,
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'ID of the vehicle involved in the incident',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ApiProperty({
    description: 'ID of the parking space where the incident occurred',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  spaceId?: number;
}

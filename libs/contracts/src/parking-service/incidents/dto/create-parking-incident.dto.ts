import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TaskPriority } from '@app/contracts/common/enums/task-priority.enum';
import { IncidentType } from '../enums/incident-type.enum';

export class CreateParkingIncidentDto {
  @ApiProperty({ enum: IncidentType, example: IncidentType.VEHICLE_DAMAGE })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty()
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  responsible: string;

  @ApiProperty({ required: false, enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  spaceId?: number;
}

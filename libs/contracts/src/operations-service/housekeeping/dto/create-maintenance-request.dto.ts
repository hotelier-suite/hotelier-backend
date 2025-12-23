import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { HousekeepingMaintenanceType } from '../enums/maintenance-type.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateHousekeepingMaintenanceRequestDto {
  @ApiProperty({
    description: 'Room number where maintenance is needed',
    example: '101',
  })
  @IsString()
  @Length(1, 10)
  roomNumber: string;

  @ApiProperty({
    description: 'Type of maintenance required',
    enum: HousekeepingMaintenanceType,
    example: HousekeepingMaintenanceType.PLUMBING,
  })
  @IsEnum(HousekeepingMaintenanceType)
  type: HousekeepingMaintenanceType;

  @ApiProperty({
    description: 'Detailed description of the maintenance issue',
    example: 'Bathroom faucet leaking, needs immediate attention',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Priority level of the maintenance request',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Name of the person who reported the issue',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  reportedBy: string;

  @ApiProperty({
    description: 'ID of the room where maintenance is needed',
    example: 101,
  })
  @IsNumber()
  @Min(1)
  roomId: number;
}

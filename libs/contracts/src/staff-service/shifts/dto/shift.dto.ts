import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import type { EmployeeDto } from '../../employees';
import { ShiftStatus, ShiftType } from '../enums';

export class ShiftDto {
  @ApiProperty({ description: 'Unique identifier for the shift', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Date of the shift',
    type: String,
    format: 'date',
    example: '2024-01-15',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Shift start time in 24-hour format',
    example: '08:00',
    format: 'time',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'Shift end time in 24-hour format',
    example: '16:00',
    format: 'time',
  })
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty({
    description: 'Type of shift (morning, afternoon, night, etc.)',
    enum: ShiftType,
    example: ShiftType.MORNING,
  })
  @IsEnum(ShiftType)
  type: ShiftType;

  @ApiProperty({
    description: 'Current status of the shift',
    enum: ShiftStatus,
    example: ShiftStatus.SCHEDULED,
  })
  @IsEnum(ShiftStatus)
  status: ShiftStatus;

  @ApiProperty({
    description: 'Job position or role for this shift',
    example: 'Front Desk Agent',
  })
  @IsString()
  @Length(1, 100)
  position: string;

  @ApiProperty({
    description: 'Department where the shift takes place',
    example: 'Reception',
  })
  @IsString()
  @Length(1, 100)
  department: string;

  @ApiProperty({
    description: 'Additional notes or comments about the shift',
    required: false,
    example: 'Training new employee',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the shift record was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the shift record was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the employee assigned to this shift',
    example: 1,
  })
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({
    description: 'Related employee details',
    required: false,
  })
  @IsOptional()
  employee?: EmployeeDto;
}

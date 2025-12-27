import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import type { EmployeeDto } from '../../employees';
import { AttendanceStatus } from '..';

export class AttendanceDto {
  @ApiProperty({
    description: 'Unique identifier for the attendance record',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Date of the attendance record',
    type: String,
    format: 'date',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Check-in time in 24-hour format',
    required: false,
    example: '09:00',
    format: 'time',
  })
  @IsOptional()
  @IsMilitaryTime()
  checkIn?: string;

  @ApiProperty({
    description: 'Check-out time in 24-hour format',
    required: false,
    example: '17:30',
    format: 'time',
  })
  @IsOptional()
  @IsMilitaryTime()
  checkOut?: string;

  @ApiProperty({
    description: 'Current attendance status of the employee',
    required: false,
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiProperty({
    description: 'Additional notes or comments about the attendance',
    required: false,
    example: 'Late due to traffic',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Total hours worked for the day',
    required: false,
    example: 8.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hoursWorked?: number;

  @ApiProperty({
    description: 'Overtime hours worked beyond regular shift',
    required: false,
    example: 1.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  overtimeHours?: number;

  @ApiProperty({
    description: 'Timestamp when the attendance record was created',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the attendance record was last updated',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the employee this attendance record belongs to',
    example: 1,
    minimum: 1,
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

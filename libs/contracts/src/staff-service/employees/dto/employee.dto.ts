import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Department, StaffStatus } from '..';

export class EmployeeDto {
  @ApiProperty({
    description: 'Unique identifier for the employee',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique employee code for internal reference',
    example: 'EMP001',
  })
  @IsString()
  @Length(1, 20)
  employeeId: string;

  @ApiProperty({
    description: 'Full name of the employee',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Department the employee belongs to',
    enum: Department,
    example: Department.HOUSEKEEPING,
  })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({
    description: 'Job position or role of the employee',
    example: 'Housekeeping Supervisor',
  })
  @IsString()
  @Length(1, 100)
  position: string;

  @ApiProperty({
    description: 'Current shift assignment for the employee',
    required: false,
    example: 'Morning',
  })
  @IsOptional()
  @IsString()
  shift?: string;

  @ApiProperty({
    description: 'Number of rooms assigned to the employee',
    required: false,
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  assignedRooms?: number;

  @ApiProperty({
    description: 'Number of rooms completed by the employee',
    required: false,
    example: 12,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  completedRooms?: number;

  @ApiProperty({
    description: 'Current status of the employee',
    required: false,
    enum: StaffStatus,
    example: StaffStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({
    description: 'Current work location of the employee',
    required: false,
    example: 'Floor 2',
  })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiProperty({
    description: 'Timestamp when the employee record was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the employee record was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

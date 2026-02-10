import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Department, StaffStatus } from '../enums';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Unique employee code for internal reference',
    example: 'EMP001',
  })
  @IsString()
  @Length(1, 20)
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  employeeId: string;

  @ApiProperty({
    description: 'Full name of the employee',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
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
  @Transform(({ value }: { value: string }) => value?.trim())
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
}

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
import { Department } from '../enums/department.enum';
import { StaffStatus } from '../enums/staff-status.enum';

export class EmployeeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'EMP001' })
  @IsString()
  @Length(1, 20)
  employeeId: string;

  @ApiProperty({ example: 'Mary Johnson' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ enum: Department, example: Department.HOUSEKEEPING })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ example: 'Housekeeping Supervisor' })
  @IsString()
  @Length(1, 100)
  position: string;

  @ApiProperty({ required: false, example: 'Morning' })
  @IsOptional()
  @IsString()
  shift?: string;

  @ApiProperty({ required: false, example: 15, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  assignedRooms?: number;

  @ApiProperty({ required: false, example: 12, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  completedRooms?: number;

  @ApiProperty({
    required: false,
    enum: StaffStatus,
    example: StaffStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({ required: false, example: 'Floor 2' })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

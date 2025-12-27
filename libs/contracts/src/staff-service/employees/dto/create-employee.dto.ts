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
import { Department, StaffStatus } from '..';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP001' })
  @IsString()
  @Length(1, 20)
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  employeeId: string;

  @ApiProperty({ example: 'Mary Johnson' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiProperty({ enum: Department, example: Department.HOUSEKEEPING })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ example: 'Housekeeping Supervisor' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
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
}

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
import { AttendanceStatus } from '..';

export class CreateAttendanceDto {
  @ApiProperty({ type: String, example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ required: false, example: '09:00' })
  @IsOptional()
  @IsMilitaryTime()
  checkIn?: string;

  @ApiProperty({ required: false, example: '17:30' })
  @IsOptional()
  @IsMilitaryTime()
  checkOut?: string;

  @ApiProperty({
    required: false,
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiProperty({ required: false, example: 'Late due to traffic' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, example: 8.5, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hoursWorked?: number;

  @ApiProperty({ required: false, example: 1.5, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  overtimeHours?: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  employeeId: number;
}

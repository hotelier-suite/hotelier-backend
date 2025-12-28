import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CleaningStatus } from '..';
import { TaskPriority } from '@app/contracts/common';

export class CleaningTaskDto {
  @ApiProperty({
    description: 'Unique identifier for the cleaning task',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Room number to be cleaned', example: '101' })
  @IsString()
  @Length(1, 10)
  roomNumber: string;

  @ApiProperty({
    description: 'Current status of the cleaning task',
    enum: CleaningStatus,
    example: CleaningStatus.PENDING,
  })
  @IsEnum(CleaningStatus)
  status: CleaningStatus;

  @ApiProperty({
    description: 'Name of the employee assigned to this task',
    example: 'Mary Johnson',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedEmployee?: string;

  @ApiProperty({
    description: 'Additional notes about the cleaning task',
    example: 'Deep cleaning required',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiProperty({
    description: 'Time when the cleaning started',
    example: '2024-01-15T09:00:00Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @ApiProperty({
    description: 'Time when the cleaning ended',
    example: '2024-01-15T10:30:00Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @ApiProperty({
    description: 'Estimated time to complete the task (in minutes)',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedTime?: number;

  @ApiProperty({
    description: 'Priority level of the cleaning task',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ description: 'ID of the room to be cleaned', example: 101 })
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T10:30:00Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TaskPriority } from '..';

export class CreateCleaningTaskDto {
  @ApiProperty({ description: 'Room number to be cleaned', example: '101' })
  @IsString()
  @Length(1, 10)
  roomNumber: string;

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
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ description: 'ID of the room to be cleaned', example: 101 })
  @IsNumber()
  @Min(1)
  roomId: number;
}

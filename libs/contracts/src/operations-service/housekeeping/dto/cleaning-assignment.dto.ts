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
  Max,
  Min,
} from 'class-validator';
import { CleaningStatus } from '../enums/cleaning-status.enum';

export class CleaningAssignmentDto {
  @ApiProperty({
    description: 'Unique identifier for the cleaning assignment',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Date when the cleaning assignment was assigned',
    example: '2024-01-15T08:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  assignedDate: Date;

  @ApiProperty({
    description: 'Date and time when cleaning work started',
    example: '2024-01-15T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({
    description: 'Date and time when cleaning work was completed',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({
    description: 'Current status of the cleaning assignment',
    enum: CleaningStatus,
    example: CleaningStatus.PENDING,
  })
  @IsEnum(CleaningStatus)
  status: CleaningStatus;

  @ApiProperty({
    description: 'Additional notes about the cleaning assignment',
    example: 'Deep cleaning required after guest checkout',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiProperty({
    description: 'Quality score of the completed cleaning (0-10)',
    example: 9.5,
    minimum: 0,
    maximum: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  qualityScore?: number;

  @ApiProperty({
    description: 'ID of the employee assigned to this cleaning task',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  employeeId?: number;

  @ApiProperty({ description: 'ID of the room to be cleaned', example: 101 })
  @IsNumber()
  @Min(1)
  roomId: number;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

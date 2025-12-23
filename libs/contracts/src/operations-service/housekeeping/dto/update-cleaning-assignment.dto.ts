import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCleaningAssignmentDto } from './create-cleaning-assignment.dto';
import { CleaningStatus } from '../enums/cleaning-status.enum';

export class UpdateCleaningAssignmentDto extends PartialType(CreateCleaningAssignmentDto) {
  @ApiProperty({ description: 'Current status of the cleaning assignment', enum: CleaningStatus, required: false })
  @IsOptional()
  @IsEnum(CleaningStatus)
  status?: CleaningStatus;

  @ApiProperty({ description: 'Date and time when cleaning work started', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({ description: 'Date and time when cleaning work was completed', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({ description: 'Quality score of the completed cleaning (0-10)', minimum: 0, maximum: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  qualityScore?: number;

  @ApiProperty({ description: 'Additional notes about the cleaning assignment', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}

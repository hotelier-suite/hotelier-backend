import { PartialType } from '@nestjs/swagger';
import { CreateCleaningTaskDto } from './create-cleaning-task.dto';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CleaningStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCleaningTaskDto extends PartialType(CreateCleaningTaskDto) {
  @ApiProperty({
    description: 'Current status of the cleaning task',
    enum: CleaningStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(CleaningStatus)
  status?: CleaningStatus;

  @ApiProperty({
    description: 'Time when the cleaning started',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startTime?: Date;

  @ApiProperty({
    description: 'Time when the cleaning ended',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;
}

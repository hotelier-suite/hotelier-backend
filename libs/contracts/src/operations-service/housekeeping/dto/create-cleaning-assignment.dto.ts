import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateCleaningAssignmentDto {
  @ApiProperty({ description: 'ID of the employee assigned to this cleaning task', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  employeeId?: number;

  @ApiProperty({ description: 'ID of the room to be cleaned', example: 101 })
  @IsNumber()
  @Min(1)
  roomId: number;

  @ApiProperty({ description: 'Additional notes about the cleaning assignment', example: 'Deep cleaning required after guest checkout', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}

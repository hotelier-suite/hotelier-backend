import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignTechnicianResponseDto {
  @ApiProperty({
    description: 'Name of the technician assigned',
    example: 'John Smith',
  })
  @IsString()
  assignedTechnician: string;
}

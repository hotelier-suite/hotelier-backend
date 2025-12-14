import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MaintenanceCostByTypeDto {
  @ApiProperty({
    description: 'Type of maintenance',
    example: 'PLUMBING',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Total cost for this maintenance type',
    example: 425.5,
  })
  @IsNumber()
  cost: number;
}

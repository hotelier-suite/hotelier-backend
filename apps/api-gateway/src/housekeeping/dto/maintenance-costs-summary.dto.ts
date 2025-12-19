import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { MaintenanceCostByTypeDto } from './maintenance-cost-by-type.dto';

export class MaintenanceCostsSummaryDto {
  @ApiProperty({
    description: 'Total maintenance costs',
    example: 1250.75,
  })
  @IsNumber()
  totalCost: number;

  @ApiProperty({
    description: 'Average cost per maintenance task',
    example: 156.34,
  })
  @IsNumber()
  averageCost: number;

  @ApiProperty({
    description: 'Costs broken down by maintenance type',
    type: [MaintenanceCostByTypeDto],
  })
  @IsArray()
  costsByType: MaintenanceCostByTypeDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class MaintenanceReportDataDto {
  @ApiProperty({ description: 'Total maintenance requests', example: 45 })
  @IsInt()
  @Min(0)
  totalRequests: number;

  @ApiProperty({ description: 'Completed maintenance requests', example: 38 })
  @IsInt()
  @Min(0)
  completedRequests: number;

  @ApiProperty({ description: 'Pending maintenance requests', example: 5 })
  @IsInt()
  @Min(0)
  pendingRequests: number;

  @ApiProperty({ description: 'In-progress maintenance requests', example: 2 })
  @IsInt()
  @Min(0)
  inProgressRequests: number;

  @ApiProperty({
    description: 'Average resolution time in hours',
    example: 4.5,
  })
  @IsNumber()
  @Min(0)
  averageResolutionTime: number;

  @ApiProperty({ description: 'Total maintenance cost', example: 5500.0 })
  @IsNumber()
  @Min(0)
  totalCost: number;

  @ApiProperty({ description: 'Preventive maintenance completed', example: 12 })
  @IsInt()
  @Min(0)
  preventiveMaintenance: number;

  @ApiProperty({ description: 'Completion rate percentage', example: 84.4 })
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate: number;
}

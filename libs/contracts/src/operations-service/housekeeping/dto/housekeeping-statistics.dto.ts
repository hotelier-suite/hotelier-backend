import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { MaintenanceReportDto } from './maintenance-report.dto';
import { CleaningAssignmentDto } from './cleaning-assignment.dto';

export class HousekeepingStatisticsDto {
  @ApiProperty({
    description: 'Number of pending maintenance reports',
    example: 5,
  })
  @IsNumber()
  pendingMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of in-progress maintenance reports',
    example: 3,
  })
  @IsNumber()
  inProgressMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of completed maintenance reports',
    example: 12,
  })
  @IsNumber()
  completedMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of pending cleaning assignments',
    example: 8,
  })
  @IsNumber()
  pendingCleaningAssignments: number;

  @ApiProperty({
    description: 'Number of in-progress cleaning assignments',
    example: 4,
  })
  @IsNumber()
  inProgressCleaningAssignments: number;

  @ApiProperty({
    description: 'Number of completed cleaning assignments',
    example: 15,
  })
  @IsNumber()
  completedCleaningAssignments: number;

  @ApiProperty({
    description: 'Maintenance reports created today',
    type: [MaintenanceReportDto],
  })
  @IsArray()
  todaysMaintenanceReports: MaintenanceReportDto[];

  @ApiProperty({
    description: 'Cleaning assignments for today',
    type: [CleaningAssignmentDto],
  })
  @IsArray()
  todaysCleaningAssignments: CleaningAssignmentDto[];
}

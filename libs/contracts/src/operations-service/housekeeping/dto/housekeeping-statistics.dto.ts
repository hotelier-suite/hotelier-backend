import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { MaintenanceReportDto } from './maintenance-report.dto';
import { CleaningAssignmentDto } from './cleaning-assignment.dto';

export class HousekeepingStatisticsDto {
  @ApiProperty({
    description: 'Number of pending maintenance reports',
    example: 5,
  })
  @IsInt()
  @Min(0)
  pendingMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of in-progress maintenance reports',
    example: 3,
  })
  @IsInt()
  @Min(0)
  inProgressMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of completed maintenance reports',
    example: 12,
  })
  @IsInt()
  @Min(0)
  completedMaintenanceReports: number;

  @ApiProperty({
    description: 'Number of pending cleaning assignments',
    example: 8,
  })
  @IsInt()
  @Min(0)
  pendingCleaningAssignments: number;

  @ApiProperty({
    description: 'Number of in-progress cleaning assignments',
    example: 4,
  })
  @IsInt()
  @Min(0)
  inProgressCleaningAssignments: number;

  @ApiProperty({
    description: 'Number of completed cleaning assignments',
    example: 15,
  })
  @IsInt()
  @Min(0)
  completedCleaningAssignments: number;

  @ApiProperty({
    description: 'Maintenance reports created today',
    type: [MaintenanceReportDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceReportDto)
  todaysMaintenanceReports: MaintenanceReportDto[];

  @ApiProperty({
    description: 'Cleaning assignments for today',
    type: [CleaningAssignmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CleaningAssignmentDto)
  todaysCleaningAssignments: CleaningAssignmentDto[];
}

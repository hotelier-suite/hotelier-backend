import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ActionStatDto } from './action-stat.dto';
import { ResourceStatDto } from './resource-stat.dto';
import { UserStatDto } from './user-stat.dto';
import { DailyActivityDto } from './daily-activity.dto';

export class AuditStatisticsDto {
  @ApiProperty({
    description: 'Period covered',
    example: '30 days',
  })
  @IsString()
  period: string;

  @ApiProperty({
    description: 'Total number of logs',
    example: 1250,
  })
  @IsInt()
  @Min(0)
  totalLogs: number;

  @ApiProperty({
    description: 'Statistics by action type',
    type: [ActionStatDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionStatDto)
  actionStats: ActionStatDto[];

  @ApiProperty({
    description: 'Statistics by resource type',
    type: [ResourceStatDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceStatDto)
  resourceStats: ResourceStatDto[];

  @ApiProperty({
    description: 'Statistics by user',
    type: [UserStatDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserStatDto)
  userStats: UserStatDto[];

  @ApiProperty({
    description: 'Daily activity statistics',
    type: [DailyActivityDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyActivityDto)
  dailyActivity: DailyActivityDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ActionStatDto {
  @ApiProperty({
    description: 'Action type',
    example: 'CREATE',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Count of actions',
    example: 450,
  })
  @IsNumber()
  count: number;
}

export class ResourceStatDto {
  @ApiProperty({
    description: 'Resource type',
    example: 'RESERVATION',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Count of resources',
    example: 320,
  })
  @IsNumber()
  count: number;
}

export class UserStatDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Count of actions by user',
    example: 85,
  })
  @IsNumber()
  count: number;
}

export class DailyActivityDto {
  @ApiProperty({
    description: 'Date',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Count of activities',
    example: 42,
  })
  @IsNumber()
  count: number;
}

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
  @IsNumber()
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

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class DashboardStatsDto {
  @ApiProperty({
    description: 'Total number of rooms in the hotel',
    example: 150,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  totalRooms: number;

  @ApiProperty({
    description: 'Number of currently occupied rooms',
    example: 120,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  occupiedRooms: number;

  @ApiProperty({
    description: 'Number of available rooms',
    example: 30,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  availableRooms: number;

  @ApiProperty({
    description: 'Total revenue in COP',
    example: 45678900,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalRevenue: number;

  @ApiProperty({
    description: 'Number of check-ins today',
    example: 25,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  todayCheckIns: number;

  @ApiProperty({
    description: 'Number of check-outs today',
    example: 18,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  todayCheckOuts: number;

  @ApiProperty({
    description: 'Number of pending guest requests',
    example: 7,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  pendingRequests: number;

  @ApiProperty({
    description: 'Number of active staff members',
    example: 45,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  activeStaff: number;
}

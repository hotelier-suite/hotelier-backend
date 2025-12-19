import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, Min } from 'class-validator';

export class OccupancyReportDataDto {
  @ApiProperty({ description: 'Total number of rooms', example: 150 })
  @IsInt()
  @Min(0)
  totalRooms: number;

  @ApiProperty({ description: 'Number of occupied rooms', example: 120 })
  @IsInt()
  @Min(0)
  occupiedRooms: number;

  @ApiProperty({ description: 'Number of available rooms', example: 30 })
  @IsInt()
  @Min(0)
  availableRooms: number;

  @ApiProperty({ description: 'Occupancy rate percentage', example: 80.0 })
  @IsNumber()
  @Min(0)
  occupancyRate: number;

  @ApiProperty({ description: 'Average daily rate', example: 125.5 })
  @IsNumber()
  @Min(0)
  averageDailyRate: number;

  @ApiProperty({ description: 'Revenue per available room', example: 100.4 })
  @IsNumber()
  @Min(0)
  revenuePerAvailableRoom: number;

  @ApiProperty({ description: 'Number of check-ins today', example: 25 })
  @IsInt()
  @Min(0)
  checkInsToday: number;

  @ApiProperty({ description: 'Number of check-outs today', example: 20 })
  @IsInt()
  @Min(0)
  checkOutsToday: number;
}

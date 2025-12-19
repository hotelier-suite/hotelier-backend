import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DashboardSummaryResponseDto {
  @ApiProperty({
    description: 'Occupancy rate percentage',
    example: 85.5,
    required: false,
  })
  @IsNumber()
  OCCUPANCY_RATE?: number;

  @ApiProperty({
    description: 'Revenue per room',
    example: 125.75,
    required: false,
  })
  @IsNumber()
  REVENUE_PER_ROOM?: number;

  @ApiProperty({
    description: 'Customer satisfaction score',
    example: 4.2,
    required: false,
  })
  @IsNumber()
  CUSTOMER_SATISFACTION?: number;

  @ApiProperty({
    description: 'Average stay length in days',
    example: 3.5,
    required: false,
  })
  @IsNumber()
  AVERAGE_STAY_LENGTH?: number;

  @ApiProperty({
    description: 'Repeat customer rate percentage',
    example: 35.8,
    required: false,
  })
  @IsNumber()
  REPEAT_CUSTOMER_RATE?: number;

  @ApiProperty({
    description: 'Staff efficiency score',
    example: 92.1,
    required: false,
  })
  @IsNumber()
  STAFF_EFFICIENCY?: number;
}

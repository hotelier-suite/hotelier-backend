import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PaymentStatisticsResponseDto {
  @ApiProperty({ description: 'Total number of payments', example: 35 })
  @IsNumber()
  @Min(0)
  totalPayments: number;

  @ApiProperty({ description: 'Total payment amount', example: 15000.0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Average payment amount', example: 428.57 })
  @IsNumber()
  @Min(0)
  averagePayment: number;

  @ApiProperty({ description: 'Number of completed payments', example: 32 })
  @IsNumber()
  @Min(0)
  completedPayments: number;

  @ApiProperty({ description: 'Number of pending payments', example: 3 })
  @IsNumber()
  @Min(0)
  pendingPayments: number;
}

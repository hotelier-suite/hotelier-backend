import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '..';

export class PaymentDto {
  @ApiProperty({
    description: 'Payment unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique payment reference',
    example: 'PAY-2024-0001',
  })
  @IsString()
  @Length(1, 100)
  reference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 275.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'Current payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Additional payment notes',
    example: 'Payment processed successfully via credit card',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @ApiProperty({
    description: 'Payment processing timestamp',
    example: '2024-01-15T15:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  processedAt: Date;

  @ApiProperty({
    description: 'Associated invoice ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  invoiceId: number;

  @ApiProperty({
    description: 'Payment record creation timestamp',
    example: '2024-01-15T15:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Payment record last update timestamp',
    example: '2024-01-15T15:35:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

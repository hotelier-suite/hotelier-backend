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
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { PaymentMethod } from '../../payments/enums/payment-method.enum';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Guest or customer name',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 200)
  guestName: string;

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issueDate?: Date;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2024-02-15T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Subtotal amount before taxes',
    example: 250.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 25.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxes: number;

  @ApiProperty({
    description: 'Total amount including taxes',
    example: 275.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'COP',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  currency?: string;

  @ApiProperty({
    description: 'Current invoice status',
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Associated reservation ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  reservationId: number;

  @ApiProperty({
    description: 'Associated user ID',
    example: 456,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}

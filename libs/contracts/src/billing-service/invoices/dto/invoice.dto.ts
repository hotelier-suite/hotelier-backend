import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { PaymentMethod } from '../../payments/enums/payment-method.enum';
import { InvoiceItemDto } from './invoice-item.dto';

export class InvoiceDto {
  @ApiProperty({
    description: 'Invoice unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique invoice number',
    example: 'INV-2024-0001',
  })
  @IsString()
  @Length(1, 50)
  number: string;

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
  })
  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2024-02-15T23:59:59.999Z',
  })
  @IsDate()
  @Type(() => Date)
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
  })
  @IsString()
  @Length(1, 10)
  currency: string;

  @ApiProperty({
    description: 'Current invoice status',
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
  })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

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

  @ApiProperty({
    description: 'Invoice line items',
    type: [InvoiceItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  invoiceItems: InvoiceItemDto[];

  @ApiProperty({
    description: 'Invoice creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Invoice last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

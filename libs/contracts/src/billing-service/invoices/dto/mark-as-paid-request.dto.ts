import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PaymentMethod } from '../../payments/enums/payment-method.enum';

export class MarkAsPaidRequestDto {
  @ApiProperty({
    description: 'Payment method used for the payment',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

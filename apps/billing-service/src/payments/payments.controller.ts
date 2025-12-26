import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import {
  PAYMENTS_PATTERNS,
  PaymentDto,
  CreatePaymentDto,
} from '@app/contracts/billing-service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(PAYMENTS_PATTERNS.FIND_ALL)
  findAll(): Promise<PaymentDto[]> {
    return this.paymentsService.findAll();
  }

  @MessagePattern(PAYMENTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<PaymentDto> {
    return this.paymentsService.findOne(id);
  }

  @MessagePattern(PAYMENTS_PATTERNS.CREATE)
  create(@Payload() data: CreatePaymentDto): Promise<PaymentDto> {
    return this.paymentsService.create(data);
  }

  @MessagePattern(PAYMENTS_PATTERNS.FIND_BY_INVOICE)
  findByInvoice(@Payload() invoiceId: number): Promise<PaymentDto[]> {
    return this.paymentsService.findByInvoice(invoiceId);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import {
  PAYMENTS_PATTERNS,
  PaymentDto,
  CreatePaymentDto,
  FindPaymentsFilterDto,
} from '@app/contracts/billing-service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(PAYMENTS_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindPaymentsFilterDto): Promise<PaymentDto[]> {
    return this.paymentsService.findAll(filters);
  }

  @MessagePattern(PAYMENTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<PaymentDto> {
    return this.paymentsService.findOne(id);
  }

  @MessagePattern(PAYMENTS_PATTERNS.CREATE)
  create(@Payload() data: CreatePaymentDto): Promise<PaymentDto> {
    return this.paymentsService.create(data);
  }
}

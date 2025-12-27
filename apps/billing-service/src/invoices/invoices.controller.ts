import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import {
  INVOICES_PATTERNS,
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
  PaymentMethod,
} from '@app/contracts/billing-service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @MessagePattern(INVOICES_PATTERNS.FIND_ALL)
  findAll(): Promise<InvoiceDto[]> {
    return this.invoicesService.findAll();
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<InvoiceDto> {
    return this.invoicesService.findOne(id);
  }

  @MessagePattern(INVOICES_PATTERNS.CREATE)
  create(@Payload() data: CreateInvoiceDto): Promise<InvoiceDto> {
    return this.invoicesService.create(data);
  }

  @MessagePattern(INVOICES_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateInvoiceDto },
  ): Promise<InvoiceDto> {
    return this.invoicesService.update(payload.id, payload.data);
  }

  @MessagePattern(INVOICES_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<InvoiceDto> {
    return this.invoicesService.remove(id);
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_STATUS)
  findByStatus(@Payload() status: InvoiceStatus): Promise<InvoiceDto[]> {
    return this.invoicesService.findByStatus(status);
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_DATE_RANGE)
  findByDateRange(
    @Payload() payload: { startDate: Date; endDate: Date },
  ): Promise<InvoiceDto[]> {
    return this.invoicesService.findByDateRange(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_OVERDUE)
  findOverdue(): Promise<InvoiceDto[]> {
    return this.invoicesService.findOverdue();
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_CUSTOMER)
  findByCustomer(@Payload() userId: number): Promise<InvoiceDto[]> {
    return this.invoicesService.findByCustomer(userId);
  }

  @MessagePattern(INVOICES_PATTERNS.MARK_AS_PAID)
  markAsPaid(
    @Payload() payload: { id: number; paymentMethod?: PaymentMethod },
  ): Promise<InvoiceDto> {
    return this.invoicesService.markAsPaid(payload.id, payload.paymentMethod);
  }

  @MessagePattern(INVOICES_PATTERNS.DOWNLOAD)
  download(@Payload() id: number): Promise<InvoiceDto> {
    return this.invoicesService.download(id);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import {
  INVOICES_PATTERNS,
  InvoiceDto,
  InvoicePdfDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  FindInvoicesFilterDto,
  PaymentMethod,
} from '@app/contracts/billing-service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @MessagePattern(INVOICES_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindInvoicesFilterDto): Promise<InvoiceDto[]> {
    return this.invoicesService.findAll(filters);
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

  @MessagePattern(INVOICES_PATTERNS.MARK_AS_PAID)
  markAsPaid(
    @Payload() payload: { id: number; paymentMethod?: PaymentMethod },
  ): Promise<InvoiceDto> {
    return this.invoicesService.markAsPaid(payload.id, payload.paymentMethod);
  }

  @MessagePattern(INVOICES_PATTERNS.GENERATE_PDF)
  generatePdf(@Payload() id: number): Promise<InvoicePdfDto> {
    return this.invoicesService.generatePdf(id);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import {
  INVOICES_PATTERNS,
  InvoiceDto,
  InvoicePdfDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  FindInvoicesFilterDto,
  PaymentMethod,
} from '@app/contracts/billing-service';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  findAll(filters: FindInvoicesFilterDto): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], FindInvoicesFilterDto>(
      INVOICES_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, number>(
      INVOICES_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateInvoiceDto): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, CreateInvoiceDto>(
      INVOICES_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateInvoiceDto): Observable<InvoiceDto> {
    return this.billingClient.send<
      InvoiceDto,
      { id: number; data: UpdateInvoiceDto }
    >(INVOICES_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, number>(
      INVOICES_PATTERNS.DELETE,
      id,
    );
  }

  markAsPaid(
    id: number,
    paymentMethod?: PaymentMethod,
  ): Observable<InvoiceDto> {
    return this.billingClient.send<
      InvoiceDto,
      { id: number; paymentMethod?: PaymentMethod }
    >(INVOICES_PATTERNS.MARK_AS_PAID, { id, paymentMethod });
  }

  generatePdf(id: number): Observable<InvoicePdfDto> {
    return this.billingClient.send<InvoicePdfDto, number>(
      INVOICES_PATTERNS.GENERATE_PDF,
      id,
    );
  }
}

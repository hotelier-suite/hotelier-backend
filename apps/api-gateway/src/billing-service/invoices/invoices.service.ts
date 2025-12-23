import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import { INVOICES_PATTERNS } from '@app/contracts/billing-service/invoices/invoices.patterns';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@app/contracts/billing-service/invoices/dto';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  findAll(): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], Record<string, never>>(
      INVOICES_PATTERNS.FIND_ALL,
      {},
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
    return this.billingClient.send<InvoiceDto, { id: number; data: UpdateInvoiceDto }>(
      INVOICES_PATTERNS.UPDATE,
      { id, data },
    );
  }

  delete(id: number): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, number>(
      INVOICES_PATTERNS.DELETE,
      id,
    );
  }

  findByStatus(status: InvoiceStatus): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], InvoiceStatus>(
      INVOICES_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  findByDateRange(startDate: string, endDate: string): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], { startDate: string; endDate: string }>(
      INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
      { startDate, endDate },
    );
  }

  findOverdue(): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], Record<string, never>>(
      INVOICES_PATTERNS.FIND_OVERDUE,
      {},
    );
  }

  findByCustomer(userId: number): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], number>(
      INVOICES_PATTERNS.FIND_BY_CUSTOMER,
      userId,
    );
  }

  markAsPaid(id: number, paymentMethod?: PaymentMethod): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, { id: number; paymentMethod?: PaymentMethod }>(
      INVOICES_PATTERNS.MARK_AS_PAID,
      { id, paymentMethod },
    );
  }

  download(id: number): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, number>(
      INVOICES_PATTERNS.DOWNLOAD,
      id,
    );
  }
}

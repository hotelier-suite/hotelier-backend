import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import {
  INVOICES_PATTERNS,
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
  PaymentMethod,
} from '@app/contracts/billing-service';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  findAll(
    status?: InvoiceStatus,
    startDate?: Date,
    endDate?: Date,
  ): Observable<InvoiceDto[]> {
    return this.billingClient.send<
      InvoiceDto[],
      { status?: InvoiceStatus; startDate?: Date; endDate?: Date }
    >(INVOICES_PATTERNS.FIND_ALL, { status, startDate, endDate });
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

  findByCustomer(userId: number): Observable<InvoiceDto[]> {
    return this.billingClient.send<InvoiceDto[], number>(
      INVOICES_PATTERNS.FIND_BY_CUSTOMER,
      userId,
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

  download(id: number): Observable<InvoiceDto> {
    return this.billingClient.send<InvoiceDto, number>(
      INVOICES_PATTERNS.DOWNLOAD,
      id,
    );
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillingService } from './billing.service';
import { INVOICES_PATTERNS } from '@app/contracts/billing-service/invoices/invoices.patterns';
import { PAYMENTS_PATTERNS } from '@app/contracts/billing-service/payments/payments.patterns';
import { STATISTICS_PATTERNS } from '@app/contracts/billing-service/statistics/statistics.patterns';
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@app/contracts/billing-service/invoices/dto';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';
import {
  PaymentDto,
  CreatePaymentDto,
} from '@app/contracts/billing-service/payments/dto';
import {
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
  MonthlyReportResponseDto,
} from '@app/contracts/billing-service/statistics/dto';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // Invoice patterns
  @MessagePattern(INVOICES_PATTERNS.FIND_ALL)
  findAllInvoices(): Promise<InvoiceDto[]> {
    return this.billingService.findAllInvoices();
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_ONE)
  findOneInvoice(@Payload() id: number): Promise<InvoiceDto> {
    return this.billingService.findOneInvoice(id);
  }

  @MessagePattern(INVOICES_PATTERNS.CREATE)
  createInvoice(@Payload() data: CreateInvoiceDto): Promise<InvoiceDto> {
    return this.billingService.createInvoice(data);
  }

  @MessagePattern(INVOICES_PATTERNS.UPDATE)
  updateInvoice(
    @Payload() payload: { id: number; data: UpdateInvoiceDto },
  ): Promise<InvoiceDto> {
    return this.billingService.updateInvoice(payload.id, payload.data);
  }

  @MessagePattern(INVOICES_PATTERNS.DELETE)
  deleteInvoice(@Payload() id: number): Promise<InvoiceDto> {
    return this.billingService.deleteInvoice(id);
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_STATUS)
  findInvoicesByStatus(@Payload() status: InvoiceStatus): Promise<InvoiceDto[]> {
    return this.billingService.findInvoicesByStatus(status);
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_DATE_RANGE)
  findInvoicesByDateRange(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<InvoiceDto[]> {
    return this.billingService.findInvoicesByDateRange(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_OVERDUE)
  findOverdueInvoices(): Promise<InvoiceDto[]> {
    return this.billingService.findOverdueInvoices();
  }

  @MessagePattern(INVOICES_PATTERNS.FIND_BY_CUSTOMER)
  findInvoicesByCustomer(@Payload() userId: number): Promise<InvoiceDto[]> {
    return this.billingService.findInvoicesByCustomer(userId);
  }

  @MessagePattern(INVOICES_PATTERNS.MARK_AS_PAID)
  markAsPaid(
    @Payload() payload: { id: number; paymentMethod?: PaymentMethod },
  ): Promise<InvoiceDto> {
    return this.billingService.markAsPaid(payload.id, payload.paymentMethod);
  }

  @MessagePattern(INVOICES_PATTERNS.DOWNLOAD)
  downloadInvoice(@Payload() id: number): Promise<InvoiceDto> {
    return this.billingService.generateInvoicePdfData(id);
  }

  // Payment patterns
  @MessagePattern(PAYMENTS_PATTERNS.FIND_ALL)
  findAllPayments(): Promise<PaymentDto[]> {
    return this.billingService.findAllPayments();
  }

  @MessagePattern(PAYMENTS_PATTERNS.FIND_ONE)
  findOnePayment(@Payload() id: number): Promise<PaymentDto> {
    return this.billingService.findOnePayment(id);
  }

  @MessagePattern(PAYMENTS_PATTERNS.CREATE)
  createPayment(@Payload() data: CreatePaymentDto): Promise<PaymentDto> {
    return this.billingService.createPayment(data);
  }

  @MessagePattern(PAYMENTS_PATTERNS.FIND_BY_INVOICE)
  findPaymentsByInvoice(@Payload() invoiceId: number): Promise<PaymentDto[]> {
    return this.billingService.findPaymentsByInvoice(invoiceId);
  }

  // Statistics patterns
  @MessagePattern(STATISTICS_PATTERNS.FINANCIAL_SUMMARY)
  getFinancialSummary(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<FinancialSummaryResponseDto> {
    return this.billingService.getFinancialSummary(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  @MessagePattern(STATISTICS_PATTERNS.PAYMENTS)
  getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    return this.billingService.getPaymentStatistics();
  }

  @MessagePattern(STATISTICS_PATTERNS.MONTHLY_REPORT)
  generateMonthlyReport(
    @Payload() payload: { year: number; month: number },
  ): Promise<MonthlyReportResponseDto> {
    return this.billingService.generateMonthlyReport(payload.year, payload.month);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../invoices/entities';
import { Payment } from '../payments/entities';
import {
  InvoiceStatus,
  PaymentStatus,
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
  InvoiceTotalResult,
} from '@app/contracts/billing-service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    const payments = await this.paymentRepository.find();

    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;
    const completedPayments = payments.filter(
      (p) => p.status === PaymentStatus.COMPLETED,
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.status === PaymentStatus.PENDING,
    ).length;

    return {
      totalPayments,
      totalAmount,
      averagePayment,
      completedPayments,
      pendingPayments,
    };
  }

  getYearToDateFinancialSummary(): Promise<FinancialSummaryResponseDto> {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date();
    return this.getFinancialSummary(startDate, endDate);
  }

  async getFinancialSummary(
    startDate: Date,
    endDate: Date,
  ): Promise<FinancialSummaryResponseDto> {
    const totalRevenueResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<InvoiceTotalResult>();

    const paidResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PAID })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    const pendingResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PENDING })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    const now = new Date();
    const overdueResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PENDING })
      .andWhere('invoice.dueDate < :now', { now })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    return {
      totalRevenue: parseFloat(totalRevenueResult?.total || '0') || 0,
      paidAmount: parseFloat(paidResult?.total || '0') || 0,
      pendingAmount: parseFloat(pendingResult?.total || '0') || 0,
      overdueAmount: parseFloat(overdueResult?.total || '0') || 0,
      totalPaidInvoices: parseInt(paidResult?.count || '0') || 0,
      totalPendingInvoices: parseInt(pendingResult?.count || '0') || 0,
      totalOverdueInvoices: parseInt(overdueResult?.count || '0') || 0,
    };
  }
}

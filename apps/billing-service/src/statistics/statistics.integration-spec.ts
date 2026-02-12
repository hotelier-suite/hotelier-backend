import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { StatisticsModule } from './statistics.module';
import { StatisticsService } from './statistics.service';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceItem } from '../invoices/entities/invoice-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { InvoicesService } from '../invoices/invoices.service';
import { PaymentMethod } from '@app/contracts/billing-service';

describe('StatisticsService (integration)', () => {
  let module: TestingModule;
  let service: StatisticsService;
  let invoicesService: InvoicesService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [Invoice, InvoiceItem, Payment],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        StatisticsModule,
        InvoicesModule,
      ],
    }).compile();

    service = module.get(StatisticsService);
    invoicesService = module.get(InvoicesService);

    // Seed an invoice and mark it as paid
    const invoice = await invoicesService.create({
      guestName: 'Stats Test Guest',
      dueDate: new Date('2026-12-31'),
      subtotal: 1000,
      taxes: 190,
      total: 1190,
      reservationId: 200,
    });
    await invoicesService.markAsPaid(invoice.id, PaymentMethod.CASH);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should get payment statistics', async () => {
    const stats = await service.getPaymentStatistics();
    expect(stats).toBeDefined();
    expect(stats.totalPayments).toBeGreaterThanOrEqual(1);
    expect(stats.totalAmount).toBeGreaterThanOrEqual(0);
  });

  it('should get financial summary', async () => {
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2030-12-31');
    const summary = await service.getFinancialSummary(startDate, endDate);
    expect(summary).toBeDefined();
    expect(summary.totalRevenue).toBeGreaterThanOrEqual(0);
  });

  it('should get year-to-date financial summary', async () => {
    const summary = await service.getYearToDateFinancialSummary();
    expect(summary).toBeDefined();
  });
});

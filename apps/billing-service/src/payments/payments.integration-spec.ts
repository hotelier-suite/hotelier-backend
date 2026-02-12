import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { PaymentsModule } from './payments.module';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { InvoiceItem } from '../invoices/entities/invoice-item.entity';
import { InvoicesModule } from '../invoices/invoices.module';
import { InvoicesService } from '../invoices/invoices.service';
import { PaymentMethod, PaymentStatus } from '@app/contracts/billing-service';

describe('PaymentsService (integration)', () => {
  let module: TestingModule;
  let service: PaymentsService;
  let invoicesService: InvoicesService;
  let invoiceId: number;

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
            entities: [Payment, Invoice, InvoiceItem],
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
        PaymentsModule,
        InvoicesModule,
      ],
    }).compile();

    service = module.get(PaymentsService);
    invoicesService = module.get(InvoicesService);

    const invoice = await invoicesService.create({
      guestName: 'Payment Test Guest',
      dueDate: new Date('2026-06-01'),
      subtotal: 500,
      taxes: 95,
      total: 595,
      reservationId: 100,
    });
    invoiceId = invoice.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a payment with auto-generated reference', async () => {
    const result = await service.create({
      amount: 595,
      method: PaymentMethod.CREDIT_CARD,
      invoiceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.reference).toMatch(/^PAY-/);
    expect(result.status).toBe(PaymentStatus.COMPLETED);
  });

  it('should find all payments', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find payment by id', async () => {
    const created = await service.create({
      amount: 100,
      method: PaymentMethod.CASH,
      invoiceId,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.method).toBe(PaymentMethod.CASH);
  });

  it('should filter payments by invoiceId', async () => {
    const results = await service.findAll({ invoiceId });
    results.forEach((p) => expect(p.invoiceId).toBe(invoiceId));
  });

  it('should throw 404 for non-existent payment', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});

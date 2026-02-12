import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { InvoicesModule } from './invoices.module';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { InvoiceStatus, PaymentMethod } from '@app/contracts/billing-service';

describe('InvoicesService (integration)', () => {
  let module: TestingModule;
  let service: InvoicesService;

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
        InvoicesModule,
      ],
    }).compile();

    service = module.get(InvoicesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an invoice with auto-generated number', async () => {
    const result = await service.create({
      guestName: 'John Doe',
      dueDate: new Date('2026-02-15'),
      subtotal: 100,
      taxes: 19,
      total: 119,
      reservationId: 1,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.number).toMatch(/^INV-/);
    expect(result.status).toBe(InvoiceStatus.PENDING);
  });

  it('should find all invoices', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find invoice by id', async () => {
    const created = await service.create({
      guestName: 'Jane Smith',
      dueDate: new Date('2026-03-01'),
      subtotal: 200,
      taxes: 38,
      total: 238,
      reservationId: 2,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.guestName).toBe('Jane Smith');
  });

  it('should update an invoice', async () => {
    const created = await service.create({
      guestName: 'Bob Brown',
      dueDate: new Date('2026-04-01'),
      subtotal: 300,
      taxes: 57,
      total: 357,
      reservationId: 3,
    });

    const updated = await service.update(created.id, {
      guestName: 'Robert Brown',
    });
    expect(updated.guestName).toBe('Robert Brown');
  });

  it('should mark an invoice as paid', async () => {
    const created = await service.create({
      guestName: 'Alice Green',
      dueDate: new Date('2026-05-01'),
      subtotal: 150,
      taxes: 28.5,
      total: 178.5,
      reservationId: 4,
    });

    const paid = await service.markAsPaid(
      created.id,
      PaymentMethod.CREDIT_CARD,
    );
    expect(paid.status).toBe(InvoiceStatus.PAID);
    expect(paid.paymentMethod).toBe(PaymentMethod.CREDIT_CARD);
  });

  it('should remove an invoice', async () => {
    const created = await service.create({
      guestName: 'To Remove',
      dueDate: new Date('2026-06-01'),
      subtotal: 50,
      taxes: 9.5,
      total: 59.5,
      reservationId: 5,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent invoice', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});

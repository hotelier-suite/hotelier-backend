import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { BillingServiceModule } from '../src/billing-service/billing-service.module';
import { BILLING_SERVICE_CLIENT } from '../src/billing-service/constants';

describe('Billing Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BillingServiceModule],
    })
      .overrideProvider(BILLING_SERVICE_CLIENT)
      .useValue(mockClient)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Invoices ─────────────────────────────────────────────────────────

  describe('GET /api/billing/invoices', () => {
    it('should return all invoices', () => {
      const mockInvoices = [{ id: 1, totalAmount: 500 }];
      mockClient.send.mockReturnValue(of(mockInvoices));

      return request(app.getHttpServer())
        .get('/api/billing/invoices')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockInvoices);
        });
    });
  });

  describe('GET /api/billing/invoices/:id', () => {
    it('should return an invoice by id', () => {
      const mockInvoice = { id: 1, totalAmount: 500 };
      mockClient.send.mockReturnValue(of(mockInvoice));

      return request(app.getHttpServer())
        .get('/api/billing/invoices/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockInvoice);
        });
    });
  });

  describe('POST /api/billing/invoices', () => {
    it('should create an invoice', () => {
      const mockInvoice = { id: 1, reservationId: 1, status: 'PENDING' };
      mockClient.send.mockReturnValue(of(mockInvoice));

      return request(app.getHttpServer())
        .post('/api/billing/invoices')
        .send({
          guestName: 'John Doe',
          dueDate: '2025-12-31T00:00:00.000Z',
          subtotal: 400,
          taxes: 100,
          total: 500,
          reservationId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockInvoice);
        });
    });
  });

  describe('PATCH /api/billing/invoices/:id', () => {
    it('should update an invoice', () => {
      mockClient.send.mockReturnValue(of({ id: 1, totalAmount: 600 }));

      return request(app.getHttpServer())
        .patch('/api/billing/invoices/1')
        .send({ totalAmount: 600 })
        .expect(200);
    });
  });

  describe('PATCH /api/billing/invoices/:id/mark-paid', () => {
    it('should mark an invoice as paid', () => {
      const mockInvoice = { id: 1, status: 'PAID' };
      mockClient.send.mockReturnValue(of(mockInvoice));

      return request(app.getHttpServer())
        .patch('/api/billing/invoices/1/mark-paid')
        .send({ paymentMethod: 'CASH' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockInvoice);
        });
    });
  });

  describe('DELETE /api/billing/invoices/:id', () => {
    it('should delete an invoice', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/billing/invoices/1')
        .expect(200);
    });
  });

  describe('GET /api/billing/invoices/:id/download', () => {
    it('should download an invoice', () => {
      const pdfBuffer = Buffer.from('%PDF-1.4 mock content');
      mockClient.send.mockReturnValue(
        of({ buffer: pdfBuffer, filename: 'invoice-1.pdf' }),
      );

      return request(app.getHttpServer())
        .get('/api/billing/invoices/1/download')
        .expect(200)
        .expect('content-type', /application\/pdf/);
    });
  });

  // ─── Payments ─────────────────────────────────────────────────────────

  describe('GET /api/billing/payments', () => {
    it('should return all payments', () => {
      const mockPayments = [{ id: 1, amount: 500 }];
      mockClient.send.mockReturnValue(of(mockPayments));

      return request(app.getHttpServer())
        .get('/api/billing/payments')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockPayments);
        });
    });
  });

  describe('GET /api/billing/payments/:id', () => {
    it('should return a payment by id', () => {
      const mockPayment = { id: 1, amount: 500 };
      mockClient.send.mockReturnValue(of(mockPayment));

      return request(app.getHttpServer())
        .get('/api/billing/payments/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockPayment);
        });
    });
  });

  // ─── Statistics ───────────────────────────────────────────────────────

  describe('GET /api/billing/invoices/statistics', () => {
    it('should return financial summary', () => {
      const mockStats = { totalRevenue: 10000, totalInvoices: 50 };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/billing/invoices/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });

  describe('GET /api/billing/payments/statistics', () => {
    it('should return payment statistics', () => {
      const mockStats = { totalPayments: 40, averageAmount: 250 };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/billing/payments/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });
});

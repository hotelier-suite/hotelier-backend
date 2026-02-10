import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import { Invoice, InvoiceItem } from './entities';
import { Payment } from '../payments/entities';
import { InvoiceStatus, PaymentMethod } from '@app/contracts/billing-service';

jest.mock('pdfkit', () => {
  return function MockPDFDocument() {
    type Handler = (...args: unknown[]) => void;
    const eventHandlers = new Map<string, Handler>();
    const self = {
      on(event: string, handler: Handler) {
        eventHandlers.set(event, handler);
        return self;
      },
      fontSize() {
        return self;
      },
      text() {
        return self;
      },
      moveDown() {
        return self;
      },
      end() {
        const dataHandler = eventHandlers.get('data');
        const endHandler = eventHandlers.get('end');
        if (dataHandler) dataHandler(Buffer.from('pdf'));
        if (endHandler) endHandler();
      },
    };
    return self;
  };
});

describe('InvoicesService', () => {
  let service: InvoicesService;
  let invoiceRepo: Record<string, jest.Mock>;
  let invoiceItemRepo: Record<string, jest.Mock>;
  let paymentRepo: Record<string, jest.Mock>;

  const mockInvoice = {
    id: 1,
    number: 'INV-001',
    guestName: 'John Doe',
    issueDate: new Date(),
    dueDate: new Date(),
    subtotal: 100,
    taxes: 10,
    total: 110,
    currency: 'USD',
    status: InvoiceStatus.PENDING,
    reservationId: 1,
    userId: 1,
    invoiceItems: [
      {
        id: 1,
        description: 'Room',
        quantity: 1,
        price: 100,
        total: 100,
        invoiceId: 1,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    invoiceRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    invoiceItemRepo = {};

    paymentRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: getRepositoryToken(Invoice), useValue: invoiceRepo },
        {
          provide: getRepositoryToken(InvoiceItem),
          useValue: invoiceItemRepo,
        },
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
      ],
    }).compile();

    service = module.get(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all invoices with no filters', async () => {
      invoiceRepo.find.mockResolvedValueOnce([mockInvoice]);

      const result = await service.findAll({});
      expect(result).toEqual([mockInvoice]);
      expect(invoiceRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should filter by status', async () => {
      invoiceRepo.find.mockResolvedValueOnce([]);

      await service.findAll({ status: InvoiceStatus.PAID });
      expect(invoiceRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: InvoiceStatus.PAID } }),
      );
    });

    it('should filter by userId', async () => {
      invoiceRepo.find.mockResolvedValueOnce([]);

      await service.findAll({ userId: 5 });
      expect(invoiceRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 5 } }),
      );
    });

    it('should filter by date range', async () => {
      invoiceRepo.find.mockResolvedValueOnce([]);
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await service.findAll({ startDate, endDate });
      expect(invoiceRepo.find).toHaveBeenCalled();
    });

    it('should filter by startDate only', async () => {
      invoiceRepo.find.mockResolvedValueOnce([]);

      await service.findAll({ startDate: new Date('2024-01-01') });
      expect(invoiceRepo.find).toHaveBeenCalled();
    });

    it('should filter by endDate only', async () => {
      invoiceRepo.find.mockResolvedValueOnce([]);

      await service.findAll({ endDate: new Date('2024-12-31') });
      expect(invoiceRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);

      const result = await service.findOne(1);
      expect(result).toEqual(mockInvoice);
      expect(invoiceRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when not found', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save an invoice', async () => {
      const dto = {
        guestName: 'John Doe',
        dueDate: new Date(),
        subtotal: 100,
        taxes: 10,
        total: 110,
        reservationId: 1,
      };
      invoiceRepo.create.mockReturnValue(dto);
      invoiceRepo.save.mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
      expect(invoiceRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an existing invoice', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);
      invoiceRepo.create.mockReturnValue(mockInvoice);
      const merged = { ...mockInvoice, guestName: 'Jane Doe' };
      invoiceRepo.merge.mockReturnValue(merged);
      invoiceRepo.save.mockResolvedValueOnce(merged);

      const result = await service.update(1, { guestName: 'Jane Doe' });
      expect(result.guestName).toBe('Jane Doe');
    });

    it('should throw when invoice not found', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.update(999, {})).rejects.toThrow(RpcException);
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);
      invoiceRepo.create.mockReturnValue(mockInvoice);
      invoiceRepo.remove.mockResolvedValueOnce(mockInvoice);

      const result = await service.remove(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should throw when invoice not found', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark invoice as paid with provided method', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);
      const paymentEntity = { amount: 110, method: PaymentMethod.CREDIT_CARD };
      paymentRepo.create.mockReturnValue(paymentEntity);
      paymentRepo.save.mockResolvedValueOnce(paymentEntity);
      invoiceRepo.create.mockReturnValue(mockInvoice);
      const merged = {
        ...mockInvoice,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      };
      invoiceRepo.merge.mockReturnValue(merged);
      invoiceRepo.save.mockResolvedValueOnce(merged);

      const result = await service.markAsPaid(1, PaymentMethod.CREDIT_CARD);
      expect(result.status).toBe(InvoiceStatus.PAID);
      expect(paymentRepo.save).toHaveBeenCalled();
    });

    it('should default to CASH payment method', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);
      paymentRepo.create.mockReturnValue({});
      paymentRepo.save.mockResolvedValueOnce({});
      invoiceRepo.create.mockReturnValue(mockInvoice);
      const merged = {
        ...mockInvoice,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
      };
      invoiceRepo.merge.mockReturnValue(merged);
      invoiceRepo.save.mockResolvedValueOnce(merged);

      const result = await service.markAsPaid(1);
      expect(result.paymentMethod).toBe(PaymentMethod.CASH);
    });

    it('should throw when invoice not found', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.markAsPaid(999)).rejects.toThrow(RpcException);
    });
  });

  describe('generatePdf', () => {
    it('should generate a PDF buffer and filename', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(mockInvoice);

      const result = await service.generatePdf(1);
      expect(result.filename).toBe('invoice-INV-001.pdf');
      expect(result.buffer).toBeInstanceOf(Buffer);
    });

    it('should throw when invoice not found', async () => {
      invoiceRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.generatePdf(999)).rejects.toThrow(RpcException);
    });
  });
});

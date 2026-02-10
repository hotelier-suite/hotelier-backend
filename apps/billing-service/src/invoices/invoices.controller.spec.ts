import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceStatus, PaymentMethod } from '@app/contracts/billing-service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

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
    invoiceItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            markAsPaid: jest.fn(),
            generatePdf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(InvoicesController);
    service = module.get(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockInvoice]);

      const result = await controller.findAll({});
      expect(result).toEqual([mockInvoice]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = { status: InvoiceStatus.PAID, userId: 1 };
      const spy = jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);

      await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockInvoice);

      expect(await controller.findOne(1)).toEqual(mockInvoice);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = {
        guestName: 'John Doe',
        dueDate: new Date(),
        subtotal: 100,
        taxes: 10,
        total: 110,
        reservationId: 1,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockInvoice);

      expect(await controller.create(dto)).toEqual(mockInvoice);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      const payload = { id: 1, data: { guestName: 'Jane Doe' } };
      const spy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockInvoice, guestName: 'Jane Doe' });

      const result = await controller.update(payload);
      expect(result.guestName).toBe('Jane Doe');
      expect(spy).toHaveBeenCalledWith(1, payload.data);
    });
  });

  describe('remove', () => {
    it('should delegate to service.remove', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockInvoice);

      expect(await controller.remove(1)).toEqual(mockInvoice);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('markAsPaid', () => {
    it('should delegate with payment method', async () => {
      const paid = { ...mockInvoice, status: InvoiceStatus.PAID };
      const spy = jest.spyOn(service, 'markAsPaid').mockResolvedValueOnce(paid);

      const result = await controller.markAsPaid({
        id: 1,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      });
      expect(result.status).toBe(InvoiceStatus.PAID);
      expect(spy).toHaveBeenCalledWith(1, PaymentMethod.CREDIT_CARD);
    });
  });

  describe('generatePdf', () => {
    it('should delegate to service.generatePdf', async () => {
      const pdfResult = {
        buffer: Buffer.from('pdf'),
        filename: 'invoice-INV-001.pdf',
      };
      const spy = jest
        .spyOn(service, 'generatePdf')
        .mockResolvedValueOnce(pdfResult);

      expect(await controller.generatePdf(1)).toEqual(pdfResult);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});

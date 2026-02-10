import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentMethod, PaymentStatus } from '@app/contracts/billing-service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPayment = {
    id: 1,
    reference: 'PAY-001',
    amount: 110,
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    notes: 'Test',
    processedAt: new Date(),
    invoiceId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(PaymentsController);
    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockPayment]);

      expect(await controller.findAll({})).toEqual([mockPayment]);
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockPayment);

      expect(await controller.findOne(1)).toEqual(mockPayment);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = {
        amount: 110,
        method: PaymentMethod.CREDIT_CARD,
        invoiceId: 1,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockPayment);

      expect(await controller.create(dto)).toEqual(mockPayment);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});

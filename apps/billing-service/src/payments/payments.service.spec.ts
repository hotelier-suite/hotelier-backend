import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { Payment } from './entities';
import { PaymentMethod, PaymentStatus } from '@app/contracts/billing-service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repo: Record<string, jest.Mock>;

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
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: repo },
      ],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      repo.find.mockResolvedValueOnce([mockPayment]);

      const result = await service.findAll({});
      expect(result).toEqual([mockPayment]);
    });

    it('should pass filters to repository', async () => {
      repo.find.mockResolvedValueOnce([]);

      await service.findAll({ invoiceId: 5 });
      expect(repo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { invoiceId: 5 } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      repo.findOne.mockResolvedValueOnce(mockPayment);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPayment);
    });

    it('should throw RpcException when not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create and save a payment', async () => {
      const dto = {
        amount: 110,
        method: PaymentMethod.CREDIT_CARD,
        invoiceId: 1,
      };
      repo.create.mockReturnValue(dto);
      repo.save.mockResolvedValueOnce({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 1);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });
});

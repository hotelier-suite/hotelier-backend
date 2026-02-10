import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentsSeeder } from './payments.seeder';
import { Payment } from '../../payments';
import { Invoice } from '../../invoices';

describe('PaymentsSeeder', () => {
  let seeder: PaymentsSeeder;
  let paymentRepo: Record<string, jest.Mock>;
  let invoiceRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    paymentRepo = {
      count: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    invoiceRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsSeeder,
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
        { provide: getRepositoryToken(Invoice), useValue: invoiceRepo },
      ],
    }).compile();

    seeder = module.get(PaymentsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed payments when empty and invoices exist', async () => {
    paymentRepo.count.mockResolvedValueOnce(0);
    invoiceRepo.find.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]);
    paymentRepo.findOne.mockResolvedValue(null);
    paymentRepo.save.mockImplementation((data) => Promise.resolve(data));

    await seeder.seed();
    expect(paymentRepo.save).toHaveBeenCalledTimes(3);
  });

  it('should skip when payments exist', async () => {
    paymentRepo.count.mockResolvedValueOnce(5);

    await seeder.seed();
    expect(invoiceRepo.find).not.toHaveBeenCalled();
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });

  it('should skip when no invoices found', async () => {
    paymentRepo.count.mockResolvedValueOnce(0);
    invoiceRepo.find.mockResolvedValueOnce([]);

    await seeder.seed();
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });
});

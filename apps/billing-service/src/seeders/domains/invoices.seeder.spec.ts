import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoicesSeeder } from './invoices.seeder';
import { Invoice, InvoiceItem } from '../../invoices';

describe('InvoicesSeeder', () => {
  let seeder: InvoicesSeeder;
  let invoiceRepo: Record<string, jest.Mock>;
  let itemRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    invoiceRepo = {
      count: jest.fn(),
      save: jest.fn(),
    };
    itemRepo = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesSeeder,
        { provide: getRepositoryToken(Invoice), useValue: invoiceRepo },
        { provide: getRepositoryToken(InvoiceItem), useValue: itemRepo },
      ],
    }).compile();

    seeder = module.get(InvoicesSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed invoices when empty', async () => {
    invoiceRepo.count.mockResolvedValueOnce(0);
    invoiceRepo.save.mockImplementation((data) =>
      Promise.resolve({ id: 1, ...data }),
    );
    itemRepo.save.mockImplementation((data) => Promise.resolve(data));

    await seeder.seed();
    expect(invoiceRepo.count).toHaveBeenCalled();
    expect(invoiceRepo.save).toHaveBeenCalledTimes(6);
  });

  it('should skip when invoices exist', async () => {
    invoiceRepo.count.mockResolvedValueOnce(3);

    await seeder.seed();
    expect(invoiceRepo.save).not.toHaveBeenCalled();
  });
});

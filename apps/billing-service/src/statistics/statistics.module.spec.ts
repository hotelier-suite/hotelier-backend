import { Test } from '@nestjs/testing';
import { StatisticsModule } from './statistics.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from '../invoices/entities';
import { Payment } from '../payments/entities';

describe('StatisticsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [StatisticsModule],
    })
      .overrideProvider(getRepositoryToken(Invoice))
      .useValue({})
      .overrideProvider(getRepositoryToken(Payment))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

import { Test } from '@nestjs/testing';
import { InvoicesModule } from './invoices.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice, InvoiceItem } from './entities';
import { Payment } from '../payments/entities';

describe('InvoicesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [InvoicesModule],
    })
      .overrideProvider(getRepositoryToken(Invoice))
      .useValue({})
      .overrideProvider(getRepositoryToken(InvoiceItem))
      .useValue({})
      .overrideProvider(getRepositoryToken(Payment))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

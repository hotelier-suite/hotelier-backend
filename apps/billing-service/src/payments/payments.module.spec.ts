import { Test } from '@nestjs/testing';
import { PaymentsModule } from './payments.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities';

describe('PaymentsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [PaymentsModule],
    })
      .overrideProvider(getRepositoryToken(Payment))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

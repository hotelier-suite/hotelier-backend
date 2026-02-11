import { Test } from '@nestjs/testing';
import { SuppliersModule } from './suppliers.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './entities';

describe('SuppliersModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [SuppliersModule],
    })
      .overrideProvider(getRepositoryToken(Supplier))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

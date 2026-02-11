import { Test } from '@nestjs/testing';
import { BeverageInventoryModule } from './beverage-inventory.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BeverageInventory } from './entities';

describe('BeverageInventoryModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [BeverageInventoryModule],
    })
      .overrideProvider(getRepositoryToken(BeverageInventory))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

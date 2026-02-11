import { Test } from '@nestjs/testing';
import { MovementsModule } from './movements.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryMovement } from './entities';
import { InventoryItem } from '../items/entities';

describe('MovementsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MovementsModule],
    })
      .overrideProvider(getRepositoryToken(InventoryMovement))
      .useValue({})
      .overrideProvider(getRepositoryToken(InventoryItem))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

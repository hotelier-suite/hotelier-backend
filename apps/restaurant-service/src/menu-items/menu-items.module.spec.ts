import { Test } from '@nestjs/testing';
import { MenuItemsModule } from './menu-items.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from './entities';

describe('MenuItemsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MenuItemsModule],
    })
      .overrideProvider(getRepositoryToken(MenuItem))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

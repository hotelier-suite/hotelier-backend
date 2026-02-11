import { Test } from '@nestjs/testing';
import { GuestsModule } from './guests.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Guest } from './entities';

describe('GuestsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [GuestsModule],
    })
      .overrideProvider(getRepositoryToken(Guest))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

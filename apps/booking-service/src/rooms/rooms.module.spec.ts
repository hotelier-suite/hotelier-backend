import { Test } from '@nestjs/testing';
import { RoomsModule } from './rooms.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from './entities';

describe('RoomsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [RoomsModule],
    })
      .overrideProvider(getRepositoryToken(Room))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

import { Test } from '@nestjs/testing';
import { SpacesModule } from './spaces.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParkingSpace } from './entities';

describe('SpacesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [SpacesModule],
    })
      .overrideProvider(getRepositoryToken(ParkingSpace))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

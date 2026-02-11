import { Test } from '@nestjs/testing';
import { VehiclesModule } from './vehicles.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities';

describe('VehiclesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [VehiclesModule],
    })
      .overrideProvider(getRepositoryToken(Vehicle))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

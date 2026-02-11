import { Test } from '@nestjs/testing';
import { IncidentsModule } from './incidents.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParkingIncident } from './entities';

describe('IncidentsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [IncidentsModule],
    })
      .overrideProvider(getRepositoryToken(ParkingIncident))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

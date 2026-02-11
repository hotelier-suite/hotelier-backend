import { Test } from '@nestjs/testing';
import { MaintenanceRequestsModule } from './maintenance-requests.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceRequest } from './entities';

describe('MaintenanceRequestsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MaintenanceRequestsModule],
    })
      .overrideProvider(getRepositoryToken(MaintenanceRequest))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

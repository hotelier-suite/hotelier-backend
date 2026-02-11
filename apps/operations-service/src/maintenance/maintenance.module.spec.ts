import { Test } from '@nestjs/testing';
import { MaintenanceModule } from './maintenance.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeneralMaintenanceRequest } from './entities';

describe('MaintenanceModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MaintenanceModule],
    })
      .overrideProvider(getRepositoryToken(GeneralMaintenanceRequest))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

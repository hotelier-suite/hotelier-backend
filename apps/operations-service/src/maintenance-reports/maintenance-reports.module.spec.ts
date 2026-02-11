import { Test } from '@nestjs/testing';
import { MaintenanceReportsModule } from './maintenance-reports.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceReport } from './entities';

describe('MaintenanceReportsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MaintenanceReportsModule],
    })
      .overrideProvider(getRepositoryToken(MaintenanceReport))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

import { Test } from '@nestjs/testing';
import { StatisticsModule } from './statistics.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CleaningAssignment } from '../cleaning-assignments/entities';
import { MaintenanceReport } from '../maintenance-reports/entities';

describe('StatisticsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [StatisticsModule],
    })
      .overrideProvider(getRepositoryToken(CleaningAssignment))
      .useValue({})
      .overrideProvider(getRepositoryToken(MaintenanceReport))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

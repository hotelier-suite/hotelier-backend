import { Test } from '@nestjs/testing';
import { AnalyticsModule } from './analytics.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsData } from './entities';

describe('AnalyticsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AnalyticsModule],
    })
      .overrideProvider(getRepositoryToken(AnalyticsData))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

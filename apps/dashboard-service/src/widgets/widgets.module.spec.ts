import { Test } from '@nestjs/testing';
import { WidgetsModule } from './widgets.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardWidget } from './entities';

describe('WidgetsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [WidgetsModule],
    })
      .overrideProvider(getRepositoryToken(DashboardWidget))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

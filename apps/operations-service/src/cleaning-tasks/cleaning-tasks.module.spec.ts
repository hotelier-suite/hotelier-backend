import { Test } from '@nestjs/testing';
import { CleaningTasksModule } from './cleaning-tasks.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CleaningTask } from './entities';

describe('CleaningTasksModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [CleaningTasksModule],
    })
      .overrideProvider(getRepositoryToken(CleaningTask))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

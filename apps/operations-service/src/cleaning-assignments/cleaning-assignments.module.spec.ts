import { Test } from '@nestjs/testing';
import { CleaningAssignmentsModule } from './cleaning-assignments.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CleaningAssignment } from './entities';

describe('CleaningAssignmentsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [CleaningAssignmentsModule],
    })
      .overrideProvider(getRepositoryToken(CleaningAssignment))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

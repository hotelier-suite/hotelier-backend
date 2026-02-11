import { Test } from '@nestjs/testing';
import { AccessControlModule } from './access-control.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities';

describe('AccessControlModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AccessControlModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

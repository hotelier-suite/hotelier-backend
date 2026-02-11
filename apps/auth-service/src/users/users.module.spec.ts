import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities';
import { Role } from '../roles/entities';

describe('UsersModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(getRepositoryToken(Role))
      .useValue({})
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

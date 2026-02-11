import { Test } from '@nestjs/testing';
import { RolesModule } from './roles.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role, RolePermission } from './entities';
import { UserRole } from '../users/entities';

describe('RolesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [RolesModule],
    })
      .overrideProvider(getRepositoryToken(Role))
      .useValue({})
      .overrideProvider(getRepositoryToken(RolePermission))
      .useValue({})
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

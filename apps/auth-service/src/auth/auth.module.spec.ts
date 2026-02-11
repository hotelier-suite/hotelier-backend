import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../users/entities';
import { Role, RolePermission } from '../roles/entities';
import { SystemPermission } from '../permissions/entities';

describe('AuthModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(getRepositoryToken(Role))
      .useValue({})
      .overrideProvider(getRepositoryToken(SystemPermission))
      .useValue({})
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({})
      .overrideProvider(getRepositoryToken(RolePermission))
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue({ get: jest.fn().mockReturnValue('test-value') })
      .compile();

    expect(module).toBeDefined();
  });
});

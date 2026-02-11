import { Test } from '@nestjs/testing';
import { PermissionsModule } from './permissions.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SystemPermission } from './entities';
import { RolePermission } from '../roles/entities';

describe('PermissionsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [PermissionsModule],
    })
      .overrideProvider(getRepositoryToken(SystemPermission))
      .useValue({})
      .overrideProvider(getRepositoryToken(RolePermission))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

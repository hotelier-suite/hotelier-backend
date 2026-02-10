import { Test } from '@nestjs/testing';
import { AuditModule } from './audit.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from './entities';

describe('AuditModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule],
    })
      .overrideProvider(getRepositoryToken(AuditLog))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
  });
});

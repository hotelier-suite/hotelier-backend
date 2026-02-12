import { AuditServiceModule } from './audit-service.module';

describe('AuditServiceModule', () => {
  it('should be defined', () => {
    expect(AuditServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof AuditServiceModule).toBe('function');
  });
});

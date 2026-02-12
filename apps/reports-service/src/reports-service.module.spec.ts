import { ReportsServiceModule } from './reports-service.module';

describe('ReportsServiceModule', () => {
  it('should be defined', () => {
    expect(ReportsServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof ReportsServiceModule).toBe('function');
  });
});

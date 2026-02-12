import { DashboardServiceModule } from './dashboard-service.module';

describe('DashboardServiceModule', () => {
  it('should be defined', () => {
    expect(DashboardServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof DashboardServiceModule).toBe('function');
  });
});

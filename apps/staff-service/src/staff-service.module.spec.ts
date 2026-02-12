import { StaffServiceModule } from './staff-service.module';

describe('StaffServiceModule', () => {
  it('should be defined', () => {
    expect(StaffServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof StaffServiceModule).toBe('function');
  });
});

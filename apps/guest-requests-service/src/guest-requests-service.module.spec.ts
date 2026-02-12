import { GuestRequestsServiceModule } from './guest-requests-service.module';

describe('GuestRequestsServiceModule', () => {
  it('should be defined', () => {
    expect(GuestRequestsServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof GuestRequestsServiceModule).toBe('function');
  });
});

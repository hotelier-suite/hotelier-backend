import { BillingServiceModule } from './billing-service.module';

describe('BillingServiceModule', () => {
  it('should be defined', () => {
    expect(BillingServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof BillingServiceModule).toBe('function');
  });
});

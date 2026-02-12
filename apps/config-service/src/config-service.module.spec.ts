import { ConfigServiceModule as HotelierConfigServiceModule } from './config-service.module';

describe('ConfigServiceModule', () => {
  it('should be defined', () => {
    expect(HotelierConfigServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof HotelierConfigServiceModule).toBe('function');
  });
});

import { RestaurantServiceModule } from './restaurant-service.module';

describe('RestaurantServiceModule', () => {
  it('should be defined', () => {
    expect(RestaurantServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof RestaurantServiceModule).toBe('function');
  });
});

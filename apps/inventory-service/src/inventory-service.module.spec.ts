import { InventoryServiceModule } from './inventory-service.module';

describe('InventoryServiceModule', () => {
  it('should be defined', () => {
    expect(InventoryServiceModule).toBeDefined();
  });

  it('should be a module', () => {
    expect(typeof InventoryServiceModule).toBe('function');
  });
});

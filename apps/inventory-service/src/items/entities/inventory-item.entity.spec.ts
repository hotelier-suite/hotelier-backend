jest.mock('../../suppliers', () => ({
  Supplier: class Supplier {},
}));
jest.mock('../../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { InventoryItem } from './';
import {
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

describe('InventoryItem', () => {
  let item: InventoryItem;

  beforeEach(() => {
    item = new InventoryItem();
    item.id = 1;
    item.name = 'Test Item';
    item.category = InventoryCategory.LINENS;
    item.unit = 'pieces';
    item.unitCost = 10;
    item.supplier = 'Test Supplier';
    item.location = 'Storage A';
    item.minimumStock = 20;
    item.maximumStock = 200;
    item.movements = [];
  });

  describe('calculateStatus', () => {
    it('should set OUT_OF_STOCK when currentStock is 0', () => {
      item.currentStock = 0;
      item.calculateStatus();
      expect(item.status).toBe(InventoryStatus.OUT_OF_STOCK);
    });

    it('should set LOW_STOCK when currentStock equals minimumStock', () => {
      item.currentStock = 20;
      item.calculateStatus();
      expect(item.status).toBe(InventoryStatus.LOW_STOCK);
    });

    it('should set LOW_STOCK when currentStock is below minimumStock', () => {
      item.currentStock = 10;
      item.calculateStatus();
      expect(item.status).toBe(InventoryStatus.LOW_STOCK);
    });

    it('should set AVAILABLE when currentStock is above minimumStock', () => {
      item.currentStock = 100;
      item.calculateStatus();
      expect(item.status).toBe(InventoryStatus.AVAILABLE);
    });
  });
});

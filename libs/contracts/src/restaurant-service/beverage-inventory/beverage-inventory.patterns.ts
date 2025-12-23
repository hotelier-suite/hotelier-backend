export const BEVERAGE_INVENTORY_PATTERNS = {
  CREATE: 'restaurant.beverage.create',
  FIND_ALL: 'restaurant.beverage.findAll',
  FIND_ONE: 'restaurant.beverage.findOne',
  UPDATE: 'restaurant.beverage.update',
  UPDATE_STOCK: 'restaurant.beverage.updateStock',
  DELETE: 'restaurant.beverage.delete',
  FIND_LOW_STOCK: 'restaurant.beverage.findLowStock',
  FIND_BY_CATEGORY: 'restaurant.beverage.findByCategory',
} as const;

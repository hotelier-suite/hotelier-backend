export const RESTAURANT_PATTERNS = {
  // Menu Item patterns
  MENU_ITEM_CREATE: 'restaurant.menuItem.create',
  MENU_ITEM_FIND_ALL: 'restaurant.menuItem.findAll',
  MENU_ITEM_FIND_ONE: 'restaurant.menuItem.findOne',
  MENU_ITEM_UPDATE: 'restaurant.menuItem.update',
  MENU_ITEM_DELETE: 'restaurant.menuItem.delete',

  // Room Service Order patterns
  ORDER_CREATE: 'restaurant.order.create',
  ORDER_FIND_ALL: 'restaurant.order.findAll',
  ORDER_FIND_ONE: 'restaurant.order.findOne',
  ORDER_UPDATE: 'restaurant.order.update',
  ORDER_DELETE: 'restaurant.order.delete',

  // Beverage Inventory patterns
  BEVERAGE_CREATE: 'restaurant.beverage.create',
  BEVERAGE_FIND_ALL: 'restaurant.beverage.findAll',
  BEVERAGE_FIND_ONE: 'restaurant.beverage.findOne',
  BEVERAGE_UPDATE: 'restaurant.beverage.update',
  BEVERAGE_UPDATE_STOCK: 'restaurant.beverage.updateStock',
  BEVERAGE_DELETE: 'restaurant.beverage.delete',
  BEVERAGE_FIND_LOW_STOCK: 'restaurant.beverage.findLowStock',
  BEVERAGE_FIND_BY_CATEGORY: 'restaurant.beverage.findByCategory',
} as const;

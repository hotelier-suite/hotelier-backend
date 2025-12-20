export const INVENTORY_ITEMS_PATTERNS = {
  GET_ALL: 'inventory.items.getAll',
  GET_BY_CATEGORY: 'inventory.items.getByCategory',
  GET_BY_STATUS: 'inventory.items.getByStatus',
  GET_LOW_STOCK: 'inventory.items.getLowStock',
  CREATE: 'inventory.items.create',
  UPDATE: 'inventory.items.update',
  DELETE: 'inventory.items.delete',
} as const;

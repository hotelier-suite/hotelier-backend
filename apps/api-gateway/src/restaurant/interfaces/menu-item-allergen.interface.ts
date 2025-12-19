export interface MenuItemAllergen {
  id: number;
  menuItemId: number;
  allergenName: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

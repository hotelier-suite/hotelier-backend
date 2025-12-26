import { MovementType } from '@app/contracts/inventory-service';

export interface MovementSeedData {
  type: MovementType;
  inventoryId: number;
  quantity: number;
  reason: string;
  cost?: number;
  user: string;
  responsible?: string;
  notes?: string;
}

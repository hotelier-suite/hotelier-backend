export interface RoomServiceOrderItem {
  id: number;
  roomServiceOrderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

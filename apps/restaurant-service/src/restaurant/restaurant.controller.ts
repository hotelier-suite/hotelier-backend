import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import {
  MENU_ITEMS_PATTERNS,
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  ROOM_SERVICE_ORDERS_PATTERNS,
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
  BEVERAGE_INVENTORY_PATTERNS,
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
} from '@app/contracts/restaurant-service';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Menu Items patterns
  @MessagePattern(MENU_ITEMS_PATTERNS.FIND_ALL)
  findAllMenuItems(): Promise<MenuItemDto[]> {
    return this.restaurantService.findAllMenuItems();
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.FIND_ONE)
  findOneMenuItem(@Payload() id: number): Promise<MenuItemDto> {
    return this.restaurantService.findOneMenuItem(id);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.CREATE)
  createMenuItem(@Payload() data: CreateMenuItemDto): Promise<MenuItemDto> {
    return this.restaurantService.createMenuItem(data);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.UPDATE)
  updateMenuItem(
    @Payload() payload: { id: number; data: UpdateMenuItemDto },
  ): Promise<MenuItemDto> {
    return this.restaurantService.updateMenuItem(payload.id, payload.data);
  }

  @MessagePattern(MENU_ITEMS_PATTERNS.DELETE)
  deleteMenuItem(@Payload() id: number): Promise<MenuItemDto> {
    return this.restaurantService.deleteMenuItem(id);
  }

  // Room Service Orders patterns
  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ALL)
  findAllOrders(): Promise<RoomServiceOrderDto[]> {
    return this.restaurantService.findAllOrders();
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ONE)
  findOneOrder(@Payload() id: number): Promise<RoomServiceOrderDto> {
    return this.restaurantService.findOneOrder(id);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.CREATE)
  createOrder(
    @Payload() data: CreateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
    return this.restaurantService.createOrder(data);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.UPDATE)
  updateOrder(
    @Payload() payload: { id: number; data: UpdateRoomServiceOrderDto },
  ): Promise<RoomServiceOrderDto> {
    return this.restaurantService.updateOrder(payload.id, payload.data);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.DELETE)
  deleteOrder(@Payload() id: number): Promise<RoomServiceOrderDto> {
    return this.restaurantService.deleteOrder(id);
  }

  // Beverage Inventory patterns
  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_ALL)
  findAllBeverages(): Promise<BeverageInventoryDto[]> {
    return this.restaurantService.findAllBeverages();
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_ONE)
  findOneBeverage(@Payload() id: number): Promise<BeverageInventoryDto> {
    return this.restaurantService.findOneBeverage(id);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.CREATE)
  createBeverage(
    @Payload() data: CreateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    return this.restaurantService.createBeverage(data);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.UPDATE)
  updateBeverage(
    @Payload() payload: { id: number; data: UpdateBeverageItemDto },
  ): Promise<BeverageInventoryDto> {
    return this.restaurantService.updateBeverage(payload.id, payload.data);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.UPDATE_STOCK)
  updateBeverageStock(
    @Payload() payload: { id: number; stock: number },
  ): Promise<BeverageInventoryDto> {
    return this.restaurantService.updateBeverageStock(
      payload.id,
      payload.stock,
    );
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.DELETE)
  deleteBeverage(@Payload() id: number): Promise<BeverageInventoryDto> {
    return this.restaurantService.deleteBeverage(id);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_LOW_STOCK)
  findLowStockBeverages(): Promise<BeverageInventoryDto[]> {
    return this.restaurantService.findLowStockBeverages();
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_BY_CATEGORY)
  findBeveragesByCategory(
    @Payload() category: string,
  ): Promise<BeverageInventoryDto[]> {
    return this.restaurantService.findBeveragesByCategory(category);
  }
}

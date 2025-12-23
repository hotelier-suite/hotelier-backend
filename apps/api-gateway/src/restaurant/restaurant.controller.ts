import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRoomServiceOrderDto } from './dto/create-room-service-order.dto';
import { UpdateRoomServiceOrderDto } from './dto/update-room-service-order.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { CreateBeverageItemDto } from './dto/create-beverage-item.dto';
import { UpdateBeverageStockDto } from './dto/update-beverage-stock.dto';
import { RoomServiceOrder } from './entities/room-service-order.entity';
import { MenuItem } from './entities/menu-item.entity';
import { BeverageInventory } from './entities/beverage-inventory.entity';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('restaurant')
@Controller('restaurant')
@AuditLog({ resource: AuditResource.RESTAURANT })
@ApiBearerAuth()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Room Service Orders endpoints
  @Get('room-service-orders')
  @ApiOperation({
    summary: 'Get All Room Service Orders',
    description:
      'Retrieve all room service orders sorted by creation date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Room service orders retrieved successfully',
    type: [RoomServiceOrder],
  })
  getRoomServiceOrders(): Promise<RoomServiceOrder[]> {
    return this.restaurantService.getRoomServiceOrders();
  }

  @Get('room-service-orders/:id')
  @ApiOperation({
    summary: 'Get Room Service Order by ID',
    description: 'Retrieve a specific room service order by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room service order ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room service order retrieved successfully',
    type: RoomServiceOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Room service order not found',
  })
  getRoomServiceOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoomServiceOrder | null> {
    return this.restaurantService.getRoomServiceOrderById(id);
  }

  @Post('room-service-orders')
  @ApiOperation({
    summary: 'Create Room Service Order',
    description:
      'Create a new room service order with automatic order number generation.',
  })
  @ApiBody({
    description: 'Room service order creation data',
    type: CreateRoomServiceOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Room service order created successfully',
    type: RoomServiceOrder,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  createRoomServiceOrder(
    @Body() orderData: CreateRoomServiceOrderDto,
  ): Promise<RoomServiceOrder> {
    return this.restaurantService.createRoomServiceOrder(orderData);
  }

  @Put('room-service-orders/:id')
  @ApiOperation({
    summary: 'Update Room Service Order',
    description:
      'Update an existing room service order (status, waiter, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Room service order ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Room service order update data',
    type: UpdateRoomServiceOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Room service order updated successfully',
    type: RoomServiceOrder,
  })
  @ApiResponse({
    status: 404,
    description: 'Room service order not found',
  })
  updateRoomServiceOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateRoomServiceOrderDto,
  ): Promise<RoomServiceOrder> {
    return this.restaurantService.updateRoomServiceOrder(id, updateData);
  }

  // Menu Items endpoints
  @Get('menu-items')
  @ApiOperation({
    summary: 'Get All Menu Items',
    description: 'Retrieve all menu items sorted by category and name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu items retrieved successfully',
    type: [MenuItem],
  })
  getMenuItems(): Promise<MenuItem[]> {
    return this.restaurantService.getMenuItems();
  }

  @Get('menu-items/:id')
  @ApiOperation({
    summary: 'Get Menu Item by ID',
    description: 'Retrieve a specific menu item by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu item ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Menu item retrieved successfully',
    type: MenuItem,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  getMenuItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MenuItem | null> {
    return this.restaurantService.getMenuItemById(id);
  }

  @Post('menu-items')
  @ApiOperation({
    summary: 'Create Menu Item',
    description: 'Create a new menu item with automatic item code generation.',
  })
  @ApiBody({
    description: 'Menu item creation data',
    type: CreateMenuItemDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Menu item created successfully',
    type: MenuItem,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  createMenuItem(@Body() itemData: CreateMenuItemDto): Promise<MenuItem> {
    return this.restaurantService.createMenuItem(itemData);
  }

  @Put('menu-items/:id')
  @ApiOperation({
    summary: 'Update Menu Item',
    description: 'Update an existing menu item (price, availability, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu item ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Menu item update data',
    type: UpdateMenuItemDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Menu item updated successfully',
    type: MenuItem,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  updateMenuItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.restaurantService.updateMenuItem(id, updateData);
  }

  @Delete('menu-items/:id')
  @ApiOperation({
    summary: 'Delete Menu Item',
    description: 'Delete a menu item from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Menu item ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Menu item deleted successfully',
    type: MenuItem,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  deleteMenuItem(@Param('id', ParseIntPipe) id: number): Promise<MenuItem> {
    return this.restaurantService.deleteMenuItem(id);
  }

  // Beverage Inventory endpoints
  @Get('beverage-inventory')
  @ApiOperation({
    summary: 'Get All Beverage Inventory',
    description: 'Retrieve all beverage inventory items sorted by name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Beverage inventory retrieved successfully',
    type: [BeverageInventory],
  })
  getBeverageInventory(): Promise<BeverageInventory[]> {
    return this.restaurantService.getBeverageInventory();
  }

  @Get('beverage-inventory/:id')
  @ApiOperation({
    summary: 'Get Beverage Item by ID',
    description: 'Retrieve a specific beverage item by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Beverage item ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Beverage item retrieved successfully',
    type: BeverageInventory,
  })
  @ApiResponse({
    status: 404,
    description: 'Beverage item not found',
  })
  getBeverageItemById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BeverageInventory | null> {
    return this.restaurantService.getBeverageItemById(id);
  }

  @Post('beverage-inventory')
  @ApiOperation({
    summary: 'Create Beverage Item',
    description:
      'Create a new beverage inventory item with automatic item code generation.',
  })
  @ApiBody({
    description: 'Beverage item creation data',
    type: CreateBeverageItemDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Beverage item created successfully',
    type: BeverageInventory,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  createBeverageItem(
    @Body() itemData: CreateBeverageItemDto,
  ): Promise<BeverageInventory> {
    return this.restaurantService.createBeverageItem(itemData);
  }

  @Put('beverage-inventory/:id/stock')
  @ApiOperation({
    summary: 'Update Beverage Stock',
    description: 'Update the stock quantity of a beverage item.',
  })
  @ApiParam({
    name: 'id',
    description: 'Beverage item ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Stock update data',
    type: UpdateBeverageStockDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Beverage stock updated successfully',
    type: BeverageInventory,
  })
  @ApiResponse({
    status: 404,
    description: 'Beverage item not found',
  })
  updateBeverageStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBeverageStockDto,
  ): Promise<BeverageInventory> {
    return this.restaurantService.updateBeverageStock(id, body.stock);
  }
}

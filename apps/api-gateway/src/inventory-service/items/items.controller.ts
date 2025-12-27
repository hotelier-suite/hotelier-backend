import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { ItemsService } from './items.service';
import {
  InventoryItemDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

@ApiTags('inventory')
@Controller('inventory/items')
@AuditLog({ resource: AuditResource.INVENTORY })
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Inventory Items',
    description: 'Retrieve all inventory items.',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: [InventoryItemDto],
  })
  findAll(): Observable<InventoryItemDto[]> {
    return this.itemsService.findAll();
  }

  @Get('by-category/:category')
  @ApiOperation({
    summary: 'Get Inventory Items by Category',
    description: 'Retrieve inventory items filtered by category.',
  })
  @ApiParam({
    name: 'category',
    enum: InventoryCategory,
    description: 'Inventory category to filter by',
    example: InventoryCategory.CLEANING_SUPPLIES,
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: [InventoryItemDto],
  })
  findByCategory(
    @Param('category') category: InventoryCategory,
  ): Observable<InventoryItemDto[]> {
    return this.itemsService.findByCategory(category);
  }

  @Get('by-status/:status')
  @ApiOperation({
    summary: 'Get Inventory Items by Status',
    description: 'Retrieve inventory items filtered by status.',
  })
  @ApiParam({
    name: 'status',
    enum: InventoryStatus,
    description: 'Inventory status to filter by',
    example: InventoryStatus.LOW_STOCK,
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: [InventoryItemDto],
  })
  findByStatus(
    @Param('status') status: InventoryStatus,
  ): Observable<InventoryItemDto[]> {
    return this.itemsService.findByStatus(status);
  }

  @Get('low-stock')
  @ApiOperation({
    summary: 'Get Low Stock Items',
    description: 'Retrieve all inventory items that are running low on stock.',
  })
  @ApiResponse({
    status: 200,
    description: 'Low stock items retrieved successfully',
    type: [InventoryItemDto],
  })
  findLowStock(): Observable<InventoryItemDto[]> {
    return this.itemsService.findLowStock();
  }

  @Post()
  @ApiOperation({
    summary: 'Create Inventory Item',
    description: 'Create a new inventory item.',
  })
  @ApiBody({
    description: 'Inventory item creation data',
    type: CreateInventoryItemDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Inventory item created successfully',
    type: InventoryItemDto,
  })
  create(@Body() data: CreateInventoryItemDto): Observable<InventoryItemDto> {
    return this.itemsService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Inventory Item',
    description: 'Update an existing inventory item.',
  })
  @ApiParam({
    name: 'id',
    description: 'Inventory item ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Inventory item update data',
    type: UpdateInventoryItemDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory item updated successfully',
    type: InventoryItemDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateInventoryItemDto,
  ): Observable<InventoryItemDto> {
    return this.itemsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Inventory Item',
    description: 'Delete an inventory item.',
  })
  @ApiParam({
    name: 'id',
    description: 'Inventory item ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory item deleted successfully',
    type: InventoryItemDto,
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<InventoryItemDto> {
    return this.itemsService.remove(id);
  }
}

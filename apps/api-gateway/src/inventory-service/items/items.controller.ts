import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
    description:
      'Retrieve all inventory items with optional filtering by category or status.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: InventoryCategory,
    description: 'Filter by inventory category',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: InventoryStatus,
    description: 'Filter by inventory status',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: [InventoryItemDto],
  })
  findAll(
    @Query('category') category?: InventoryCategory,
    @Query('status') status?: InventoryStatus,
  ): Observable<InventoryItemDto[]> {
    if (category) {
      return this.itemsService.findByCategory(category);
    }

    if (status) {
      return this.itemsService.findByStatus(status);
    }

    return this.itemsService.findAll();
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

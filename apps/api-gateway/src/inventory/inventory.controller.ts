import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { Inventory } from './entities/inventory.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { InventoryCategory } from './enums/inventory-category.enum';
import { InventoryStatus } from './enums/inventory-status.enum';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

@ApiTags('inventory')
@Controller('inventory')
@AuditLog({ resource: AuditResource.INVENTORY })
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Inventory Items endpoints
  @Get('items')
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
    type: [Inventory],
  })
  getInventoryItems(
    @Query('category') category?: InventoryCategory,
    @Query('status') status?: InventoryStatus,
  ): Promise<Inventory[]> {
    if (category) {
      return this.inventoryService.getInventoryByCategory(category);
    }
    if (status) {
      return this.inventoryService.getInventoryByStatus(status);
    }
    return this.inventoryService.getInventoryItems();
  }

  @Get('items/low-stock')
  @ApiOperation({
    summary: 'Get Low Stock Items',
    description: 'Retrieve all inventory items that are running low on stock.',
  })
  @ApiResponse({
    status: 200,
    description: 'Low stock items retrieved successfully',
    type: [Inventory],
  })
  getLowStockItems(): Promise<Inventory[]> {
    return this.inventoryService.getLowStockItems();
  }

  @Post('items')
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
    type: Inventory,
  })
  createInventoryItem(
    @Body() itemData: CreateInventoryItemDto,
  ): Promise<Inventory> {
    return this.inventoryService.createInventoryItem(itemData);
  }

  @Put('items/:id')
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
    type: Inventory,
  })
  updateInventoryItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateInventoryItemDto,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventoryItem(id, updateData);
  }

  @Delete('items/:id')
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
    type: Inventory,
  })
  deleteInventoryItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Inventory> {
    return this.inventoryService.deleteInventoryItem(id);
  }

  // Inventory Movements endpoints
  @Get('movements')
  @ApiOperation({
    summary: 'Get All Inventory Movements',
    description: 'Retrieve all inventory movements with inventory details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory movements retrieved successfully',
    type: [InventoryMovement],
  })
  getInventoryMovements(): Promise<InventoryMovement[]> {
    return this.inventoryService.getInventoryMovements();
  }

  @Post('movements')
  @ApiOperation({
    summary: 'Create Inventory Movement',
    description: 'Create a new inventory movement (in/out/adjustment).',
  })
  @ApiBody({
    description: 'Inventory movement creation data',
    type: CreateInventoryMovementDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Inventory movement created successfully',
    type: InventoryMovement,
  })
  createInventoryMovement(
    @Body() movementData: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    return this.inventoryService.createInventoryMovement(movementData);
  }

  // Suppliers endpoints
  @Get('suppliers')
  @ApiOperation({
    summary: 'Get All Suppliers',
    description: 'Retrieve all suppliers derived from inventory items.',
  })
  @ApiResponse({
    status: 200,
    description: 'Suppliers retrieved successfully',
    type: [SupplierResponseDto],
  })
  getSuppliers(): Promise<SupplierResponseDto[]> {
    return this.inventoryService.getSupplierList();
  }

  @Get('suppliers/:id')
  @ApiOperation({
    summary: 'Get Supplier by ID',
    description: 'Retrieve a specific supplier by their ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Supplier ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier retrieved successfully',
    type: SupplierResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier not found',
  })
  getSupplierById(@Param('id') id: number): Promise<SupplierResponseDto> {
    return this.inventoryService.getSupplierById(id);
  }

  @Post('suppliers')
  @ApiOperation({
    summary: 'Create Supplier',
    description: 'Create a new supplier.',
  })
  @ApiBody({
    description: 'Supplier creation data',
    type: CreateSupplierDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Supplier created successfully',
    type: SupplierResponseDto,
  })
  createSupplier(
    @Body() supplierData: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.inventoryService.createSupplier(supplierData);
  }

  @Put('suppliers/:id')
  @ApiOperation({
    summary: 'Update Supplier',
    description: 'Update an existing supplier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID',
    type: 'number',
  })
  @ApiBody({
    description: 'Supplier update data',
    type: UpdateSupplierDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier updated successfully',
    type: SupplierResponseDto,
  })
  updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.inventoryService.updateSupplier(id, updateData);
  }

  @Delete('suppliers/:id')
  @ApiOperation({
    summary: 'Delete Supplier',
    description: 'Delete a supplier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Supplier ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier deleted successfully',
    type: SupplierResponseDto,
  })
  deleteSupplier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplierResponseDto> {
    return this.inventoryService.deleteSupplier(id);
  }
}

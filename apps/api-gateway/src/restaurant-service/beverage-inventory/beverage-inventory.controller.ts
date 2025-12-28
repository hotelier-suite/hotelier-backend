import {
  Controller,
  Get,
  Post,
  Patch,
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
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { BeverageInventoryService } from './beverage-inventory.service';
import {
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  FindBeverageInventoryFilterDto,
} from '@app/contracts/restaurant-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('restaurant')
@Controller('restaurant/beverage-inventory')
@AuditLog({ resource: AuditResource.RESTAURANT })
@ApiBearerAuth()
export class BeverageInventoryController {
  constructor(
    private readonly beverageInventoryService: BeverageInventoryService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Beverage Inventory',
    description:
      'Retrieve beverage inventory items with optional filters. Filter by low stock status or category.',
  })
  @ApiResponse({
    status: 200,
    description: 'Beverage inventory retrieved successfully',
    type: [BeverageInventoryDto],
  })
  findAll(
    @Query() filters: FindBeverageInventoryFilterDto,
  ): Observable<BeverageInventoryDto[]> {
    return this.beverageInventoryService.findAll(filters);
  }

  @Get(':id')
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
    type: BeverageInventoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Beverage item not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<BeverageInventoryDto> {
    return this.beverageInventoryService.findOne(id);
  }

  @Post()
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
    type: BeverageInventoryDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(
    @Body() data: CreateBeverageItemDto,
  ): Observable<BeverageInventoryDto> {
    return this.beverageInventoryService.create(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Beverage Item',
    description: 'Update a beverage inventory item including stock quantity.',
  })
  @ApiParam({
    name: 'id',
    description: 'Beverage item ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Beverage item update data',
    type: UpdateBeverageItemDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Beverage item updated successfully',
    type: BeverageInventoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Beverage item not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBeverageItemDto,
  ): Observable<BeverageInventoryDto> {
    return this.beverageInventoryService.update(id, data);
  }
}

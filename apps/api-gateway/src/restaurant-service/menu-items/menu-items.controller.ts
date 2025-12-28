import {
  Controller,
  Get,
  Post,
  Patch,
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
import { Observable } from 'rxjs';
import { MenuItemsService } from './menu-items.service';
import {
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@app/contracts/restaurant-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('restaurant')
@Controller('restaurant/menu-items')
@AuditLog({ resource: AuditResource.RESTAURANT })
@ApiBearerAuth()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Menu Items',
    description: 'Retrieve all menu items sorted by category and name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu items retrieved successfully',
    type: [MenuItemDto],
  })
  findAll(): Observable<MenuItemDto[]> {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
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
    type: MenuItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<MenuItemDto> {
    return this.menuItemsService.findOne(id);
  }

  @Post()
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
    type: MenuItemDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() data: CreateMenuItemDto): Observable<MenuItemDto> {
    return this.menuItemsService.create(data);
  }

  @Patch(':id')
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
    type: MenuItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMenuItemDto,
  ): Observable<MenuItemDto> {
    return this.menuItemsService.update(id, data);
  }

  @Delete(':id')
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
    type: MenuItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<MenuItemDto> {
    return this.menuItemsService.remove(id);
  }
}

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
import { SuppliersService } from './suppliers.service';
import {
  SupplierResponseDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from '@app/contracts/inventory-service';

@ApiTags('inventory')
@Controller('inventory/suppliers')
@AuditLog({ resource: AuditResource.INVENTORY })
@ApiBearerAuth()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Suppliers',
    description:
      'Retrieve all suppliers registered in the inventory system. Returns supplier contact information and details for procurement purposes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Suppliers retrieved successfully',
    type: [SupplierResponseDto],
  })
  findAll(): Observable<SupplierResponseDto[]> {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Supplier by ID',
    description:
      'Retrieve a specific supplier by their unique identifier. Returns detailed supplier information including contact details and address.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the supplier',
    example: 1,
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
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Supplier',
    description:
      'Create a new supplier in the inventory system. Registers supplier contact information and details for future procurement orders.',
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
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(@Body() data: CreateSupplierDto): Observable<SupplierResponseDto> {
    return this.suppliersService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Supplier',
    description:
      'Update an existing supplier with the provided data. Allows modification of supplier contact information and details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the supplier to update',
    type: 'number',
    example: 1,
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
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSupplierDto,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Supplier',
    description:
      'Delete a supplier from the inventory system by their unique identifier. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the supplier to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier deleted successfully',
    type: SupplierResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.remove(id);
  }
}

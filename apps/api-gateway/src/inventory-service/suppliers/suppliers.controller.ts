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
    description: 'Retrieve all suppliers.',
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
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.findOne(id);
  }

  @Post()
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
  create(@Body() data: CreateSupplierDto): Observable<SupplierResponseDto> {
    return this.suppliersService.create(data);
  }

  @Put(':id')
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSupplierDto,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.update(id, data);
  }

  @Delete(':id')
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
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<SupplierResponseDto> {
    return this.suppliersService.remove(id);
  }
}

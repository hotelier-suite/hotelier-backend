import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { MovementsService } from './movements.service';
import {
  InventoryMovementDto,
  CreateInventoryMovementDto,
} from '@app/contracts/inventory-service';

@ApiTags('inventory')
@Controller('inventory/movements')
@AuditLog({ resource: AuditResource.INVENTORY })
@ApiBearerAuth()
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Inventory Movements',
    description: 'Retrieve all inventory movements with inventory details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory movements retrieved successfully',
    type: [InventoryMovementDto],
  })
  findAll(): Observable<InventoryMovementDto[]> {
    return this.movementsService.findAll();
  }

  @Post()
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
    type: InventoryMovementDto,
  })
  create(
    @Body() data: CreateInventoryMovementDto,
  ): Observable<InventoryMovementDto> {
    return this.movementsService.create(data);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { MaintenanceService } from './maintenance.service';
import {
  GeneralMaintenanceRequestDto,
  CreateGeneralMaintenanceRequestDto,
  UpdateGeneralMaintenanceRequestDto,
} from '@app/contracts/operations-service';

@ApiTags('Maintenance')
@Controller('maintenance')
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @ApiOperation({ summary: 'Get all maintenance requests' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance requests',
    type: [GeneralMaintenanceRequestDto],
  })
  @Get()
  findAll(): Observable<GeneralMaintenanceRequestDto[]> {
    return this.maintenanceService.findAll();
  }

  @ApiOperation({ summary: 'Get maintenance request by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance request',
    type: GeneralMaintenanceRequestDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new maintenance request' })
  @ApiBody({ type: CreateGeneralMaintenanceRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: GeneralMaintenanceRequestDto,
  })
  @Post()
  create(
    @Body() data: CreateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.create(data);
  }

  @ApiOperation({ summary: 'Update a maintenance request' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request to update',
  })
  @ApiBody({ type: UpdateGeneralMaintenanceRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: GeneralMaintenanceRequestDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a maintenance request' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request deleted successfully',
    type: GeneralMaintenanceRequestDto,
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.remove(id);
  }
}

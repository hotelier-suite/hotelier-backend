import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
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
import { MaintenanceRequestsService } from './maintenance-requests.service';
import {
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
} from '@app/contracts/operations-service';

@ApiTags('Maintenance Requests')
@Controller('housekeeping/maintenance-requests')
@ApiBearerAuth()
export class MaintenanceRequestsController {
  constructor(
    private readonly maintenanceRequestsService: MaintenanceRequestsService,
  ) {}

  @ApiOperation({ summary: 'Get all maintenance requests' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance requests',
    type: [HousekeepingMaintenanceRequestDto],
  })
  @Get()
  findAll(): Observable<HousekeepingMaintenanceRequestDto[]> {
    return this.maintenanceRequestsService.findAll();
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
    type: HousekeepingMaintenanceRequestDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new maintenance request' })
  @ApiBody({ type: CreateHousekeepingMaintenanceRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Post()
  create(
    @Body() data: CreateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.create(data);
  }

  @ApiOperation({ summary: 'Update a maintenance request' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance request to update',
  })
  @ApiBody({ type: UpdateHousekeepingMaintenanceRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.update(id, data);
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
    type: HousekeepingMaintenanceRequestDto,
  })
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.delete(id);
  }
}

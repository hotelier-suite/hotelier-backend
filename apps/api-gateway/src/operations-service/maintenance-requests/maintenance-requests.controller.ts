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

  @ApiOperation({
    summary: 'Get all maintenance requests',
    description:
      'Retrieve all housekeeping maintenance requests in the system. Returns a list of requests submitted by housekeeping staff for maintenance issues discovered during their work.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance requests',
    type: [HousekeepingMaintenanceRequestDto],
  })
  @Get()
  findAll(): Observable<HousekeepingMaintenanceRequestDto[]> {
    return this.maintenanceRequestsService.findAll();
  }

  @ApiOperation({
    summary: 'Get maintenance request by ID',
    description:
      'Retrieve a specific housekeeping maintenance request by its unique identifier. Returns detailed information about the request including the issue, room, priority, and current status.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance request',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the maintenance request',
    type: HousekeepingMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new maintenance request',
    description:
      'Create a new housekeeping maintenance request to report an issue that needs attention from the maintenance team. Typically used by housekeeping staff to escalate problems found during room cleaning.',
  })
  @ApiBody({
    type: CreateHousekeepingMaintenanceRequestDto,
    description:
      'Maintenance request data including room, issue description, and priority level',
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @Post()
  create(
    @Body() data: CreateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.create(data);
  }

  @ApiOperation({
    summary: 'Update a maintenance request',
    description:
      'Update an existing housekeeping maintenance request with new information. Can be used to change status, update priority, or add additional details about the issue.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance request to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateHousekeepingMaintenanceRequestDto,
    description: 'Updated maintenance request data',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a maintenance request',
    description:
      'Delete a housekeeping maintenance request by its unique identifier. This removes the request from the system permanently.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance request to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request deleted successfully',
    type: HousekeepingMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.maintenanceRequestsService.remove(id);
  }
}

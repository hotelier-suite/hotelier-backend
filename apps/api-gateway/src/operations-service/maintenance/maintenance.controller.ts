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

  @ApiOperation({
    summary: 'Get all maintenance requests',
    description:
      'Retrieve all general maintenance requests in the system. Returns a list of requests with their status, priority, location, and assigned personnel information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance requests',
    type: [GeneralMaintenanceRequestDto],
  })
  @Get()
  findAll(): Observable<GeneralMaintenanceRequestDto[]> {
    return this.maintenanceService.findAll();
  }

  @ApiOperation({
    summary: 'Get maintenance request by ID',
    description:
      'Retrieve a specific maintenance request by its unique identifier. Returns detailed information about the request including description, status, priority, and resolution details.',
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
    type: GeneralMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new maintenance request',
    description:
      'Create a new general maintenance request in the system. Used to report issues that need to be addressed by the maintenance team, such as equipment repairs or facility issues.',
  })
  @ApiBody({
    type: CreateGeneralMaintenanceRequestDto,
    description:
      'Maintenance request data including description, location, and priority',
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance request created successfully',
    type: GeneralMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @Post()
  create(
    @Body() data: CreateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.create(data);
  }

  @ApiOperation({
    summary: 'Update a maintenance request',
    description:
      'Update an existing maintenance request with new information. Can be used to change status, assign personnel, update priority, or add resolution notes.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the maintenance request to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateGeneralMaintenanceRequestDto,
    description: 'Updated maintenance request data',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance request updated successfully',
    type: GeneralMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGeneralMaintenanceRequestDto,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a maintenance request',
    description:
      'Delete a maintenance request by its unique identifier. This removes the request from the system permanently.',
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
    type: GeneralMaintenanceRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Maintenance request not found with the specified ID',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<GeneralMaintenanceRequestDto> {
    return this.maintenanceService.remove(id);
  }
}

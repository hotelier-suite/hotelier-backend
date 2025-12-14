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
} from '@nestjs/swagger';
import { ParkingService } from './parking.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateParkingSpaceDto } from './dto/create-parking-space.dto';
import { UpdateParkingSpaceDto } from './dto/update-parking-space.dto';
import { CreateParkingIncidentDto } from './dto/create-parking-incident.dto';
import { UpdateParkingIncidentDto } from './dto/update-parking-incident.dto';
import { ResolveIncidentRequestDto } from './dto/resolve-incident-request.dto';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingSpace } from './entities/parking-space.entity';
import { ParkingIncident } from './entities/parking-incident.entity';
import { GuestType } from './enums/guest-type.enum';
import { VehicleStatus } from './enums/vehicle-status.enum';
import { SpaceType } from './enums/space-type.enum';
import { IncidentType } from './enums/incident-type.enum';
import { IncidentStatus } from './enums/incident-status.enum';
import { TaskPriority } from '../housekeeping/enums/task-priority.enum';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

@ApiTags('parking')
@Controller('parking')
@AuditLog({ resource: AuditResource.PARKING })
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  // Vehicle endpoints
  @Get('vehicles')
  @ApiOperation({
    summary: 'Get All Vehicles',
    description: 'Retrieve a list of all vehicles in the parking system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
    type: [Vehicle],
  })
  getAllVehicles(): Promise<Vehicle[]> {
    return this.parkingService.getAllVehicles();
  }

  @Get('vehicles/by-status')
  @ApiOperation({
    summary: 'Get Vehicles by Status',
    description: 'Retrieve vehicles filtered by their current status.',
  })
  @ApiQuery({
    name: 'status',
    enum: VehicleStatus,
    description: 'Vehicle status to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
    type: [Vehicle],
  })
  getVehiclesByStatus(
    @Query('status') status: VehicleStatus,
  ): Promise<Vehicle[]> {
    return this.parkingService.getVehiclesByStatus(status);
  }

  @Get('vehicles/by-guest-type')
  @ApiOperation({
    summary: 'Get Vehicles by Guest Type',
    description: 'Retrieve vehicles filtered by guest type.',
  })
  @ApiQuery({
    name: 'guestType',
    enum: GuestType,
    description: 'Guest type to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicles retrieved successfully',
    type: [Vehicle],
  })
  getVehiclesByGuestType(
    @Query('guestType') guestType: GuestType,
  ): Promise<Vehicle[]> {
    return this.parkingService.getVehiclesByGuestType(guestType);
  }

  @Get('vehicles/:id')
  @ApiOperation({
    summary: 'Get Vehicle by ID',
    description: 'Retrieve a specific vehicle by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle retrieved successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  getVehicleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Vehicle | null> {
    return this.parkingService.getVehicleById(id);
  }

  @Get('vehicles/license/:licensePlate')
  @ApiOperation({
    summary: 'Get Vehicle by License Plate',
    description: 'Retrieve a vehicle by its license plate number.',
  })
  @ApiParam({
    name: 'licensePlate',
    description: 'Vehicle license plate',
    example: 'ABC-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle retrieved successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  getVehicleByLicensePlate(
    @Param('licensePlate') licensePlate: string,
  ): Promise<Vehicle | null> {
    return this.parkingService.getVehicleByLicensePlate(licensePlate);
  }

  @Post('vehicles')
  @ApiOperation({
    summary: 'Create Vehicle',
    description: 'Register a new vehicle in the parking system.',
  })
  @ApiBody({
    description: 'Vehicle data',
    type: CreateVehicleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
    type: Vehicle,
  })
  createVehicle(@Body() vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return this.parkingService.createVehicle(vehicleData);
  }

  @Put('vehicles/:id')
  @ApiOperation({
    summary: 'Update Vehicle',
    description: 'Update vehicle information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Updated vehicle data',
    type: UpdateVehicleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  updateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Body() vehicleData: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.parkingService.updateVehicle(id, vehicleData);
  }

  @Put('vehicles/:id/checkout')
  @ApiOperation({
    summary: 'Check Out Vehicle',
    description: 'Mark a vehicle as checked out and record exit time.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle checked out successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  checkOutVehicle(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    return this.parkingService.checkOutVehicle(id);
  }

  @Delete('vehicles/:id')
  @ApiOperation({
    summary: 'Delete Vehicle',
    description: 'Remove a vehicle from the parking system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle deleted successfully',
    type: Vehicle,
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  deleteVehicle(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    return this.parkingService.deleteVehicle(id);
  }

  // Parking space endpoints
  @Get('spaces')
  @ApiOperation({
    summary: 'Get All Parking Spaces',
    description: 'Retrieve a list of all parking spaces.',
  })
  @ApiResponse({
    status: 200,
    description: 'Parking spaces retrieved successfully',
    type: [ParkingSpace],
  })
  getAllParkingSpaces(): Promise<ParkingSpace[]> {
    return this.parkingService.getAllParkingSpaces();
  }

  @Get('spaces/available')
  @ApiOperation({
    summary: 'Get Available Spaces',
    description: 'Retrieve all available parking spaces.',
  })
  @ApiResponse({
    status: 200,
    description: 'Available spaces retrieved successfully',
    type: [ParkingSpace],
  })
  getAvailableSpaces(): Promise<ParkingSpace[]> {
    return this.parkingService.getAvailableSpaces();
  }

  @Get('spaces/by-type')
  @ApiOperation({
    summary: 'Get Spaces by Type',
    description: 'Retrieve parking spaces filtered by type.',
  })
  @ApiQuery({
    name: 'type',
    enum: SpaceType,
    description: 'Space type to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Spaces retrieved successfully',
    type: [ParkingSpace],
  })
  getSpacesByType(@Query('type') type: SpaceType): Promise<ParkingSpace[]> {
    return this.parkingService.getSpacesByType(type);
  }

  @Get('spaces/by-zone')
  @ApiOperation({
    summary: 'Get Spaces by Zone',
    description: 'Retrieve parking spaces in a specific zone.',
  })
  @ApiQuery({
    name: 'zone',
    description: 'Zone name to filter by',
    example: 'Ground Floor',
  })
  @ApiResponse({
    status: 200,
    description: 'Spaces retrieved successfully',
    type: [ParkingSpace],
  })
  getSpacesByZone(@Query('zone') zone: string): Promise<ParkingSpace[]> {
    return this.parkingService.getSpacesByZone(zone);
  }

  @Get('spaces/:id')
  @ApiOperation({
    summary: 'Get Parking Space by ID',
    description: 'Retrieve a specific parking space by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Parking space ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Parking space retrieved successfully',
    type: ParkingSpace,
  })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  getParkingSpaceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ParkingSpace | null> {
    return this.parkingService.getParkingSpaceById(id);
  }

  @Get('spaces/code/:code')
  @ApiOperation({
    summary: 'Get Parking Space by Code',
    description: 'Retrieve a parking space by its unique code.',
  })
  @ApiParam({
    name: 'code',
    description: 'Parking space code',
    example: 'G-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Parking space retrieved successfully',
    type: ParkingSpace,
  })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  getParkingSpaceByCode(
    @Param('code') code: string,
  ): Promise<ParkingSpace | null> {
    return this.parkingService.getParkingSpaceByCode(code);
  }

  @Post('spaces')
  @ApiOperation({
    summary: 'Create Parking Space',
    description: 'Create a new parking space.',
  })
  @ApiBody({
    description: 'Parking space data',
    type: CreateParkingSpaceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Parking space created successfully',
    type: ParkingSpace,
  })
  createParkingSpace(
    @Body() spaceData: CreateParkingSpaceDto,
  ): Promise<ParkingSpace> {
    return this.parkingService.createParkingSpace(spaceData);
  }

  @Put('spaces/:id')
  @ApiOperation({
    summary: 'Update Parking Space',
    description: 'Update parking space information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Parking space ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Updated parking space data',
    type: UpdateParkingSpaceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Parking space updated successfully',
    type: ParkingSpace,
  })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  updateParkingSpace(
    @Param('id', ParseIntPipe) id: number,
    @Body() spaceData: UpdateParkingSpaceDto,
  ): Promise<ParkingSpace> {
    return this.parkingService.updateParkingSpace(id, spaceData);
  }

  @Delete('spaces/:id')
  @ApiOperation({
    summary: 'Delete Parking Space',
    description: 'Remove a parking space from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Parking space ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Parking space deleted successfully',
    type: ParkingSpace,
  })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  deleteParkingSpace(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ParkingSpace> {
    return this.parkingService.deleteParkingSpace(id);
  }

  // Incident endpoints
  @Get('incidents')
  @ApiOperation({
    summary: 'Get All Incidents',
    description: 'Retrieve a list of all parking incidents.',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidents retrieved successfully',
    type: [ParkingIncident],
  })
  getAllIncidents(): Promise<ParkingIncident[]> {
    return this.parkingService.getAllIncidents();
  }

  @Get('incidents/by-status')
  @ApiOperation({
    summary: 'Get Incidents by Status',
    description: 'Retrieve incidents filtered by their status.',
  })
  @ApiQuery({
    name: 'status',
    enum: IncidentStatus,
    description: 'Incident status to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidents retrieved successfully',
    type: [ParkingIncident],
  })
  getIncidentsByStatus(
    @Query('status') status: IncidentStatus,
  ): Promise<ParkingIncident[]> {
    return this.parkingService.getIncidentsByStatus(status);
  }

  @Get('incidents/by-priority')
  @ApiOperation({
    summary: 'Get Incidents by Priority',
    description: 'Retrieve incidents filtered by their priority level.',
  })
  @ApiQuery({
    name: 'priority',
    enum: TaskPriority,
    description: 'Priority level to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidents retrieved successfully',
    type: [ParkingIncident],
  })
  getIncidentsByPriority(
    @Query('priority') priority: TaskPriority,
  ): Promise<ParkingIncident[]> {
    return this.parkingService.getIncidentsByPriority(priority);
  }

  @Get('incidents/by-type')
  @ApiOperation({
    summary: 'Get Incidents by Type',
    description: 'Retrieve incidents filtered by their type.',
  })
  @ApiQuery({
    name: 'type',
    enum: IncidentType,
    description: 'Incident type to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidents retrieved successfully',
    type: [ParkingIncident],
  })
  getIncidentsByType(
    @Query('type') type: IncidentType,
  ): Promise<ParkingIncident[]> {
    return this.parkingService.getIncidentsByType(type);
  }

  @Get('incidents/:id')
  @ApiOperation({
    summary: 'Get Incident by ID',
    description: 'Retrieve a specific incident by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Incident ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Incident retrieved successfully',
    type: ParkingIncident,
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  getIncidentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ParkingIncident | null> {
    return this.parkingService.getIncidentById(id);
  }

  @Post('incidents')
  @ApiOperation({
    summary: 'Create Incident',
    description: 'Report a new parking incident.',
  })
  @ApiBody({
    description: 'Incident data',
    type: CreateParkingIncidentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Incident created successfully',
    type: ParkingIncident,
  })
  createIncident(
    @Body() incidentData: CreateParkingIncidentDto,
  ): Promise<ParkingIncident> {
    return this.parkingService.createIncident(incidentData);
  }

  @Put('incidents/:id')
  @ApiOperation({
    summary: 'Update Incident',
    description: 'Update incident information.',
  })
  @ApiParam({
    name: 'id',
    description: 'Incident ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Updated incident data',
    type: UpdateParkingIncidentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Incident updated successfully',
    type: ParkingIncident,
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  updateIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() incidentData: UpdateParkingIncidentDto,
  ): Promise<ParkingIncident> {
    return this.parkingService.updateIncident(id, incidentData);
  }

  @Put('incidents/:id/resolve')
  @ApiOperation({
    summary: 'Resolve Incident',
    description: 'Mark an incident as resolved with resolution details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Incident ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Resolution data',
    type: ResolveIncidentRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Incident resolved successfully',
    type: ParkingIncident,
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  resolveIncident(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ResolveIncidentRequestDto,
  ): Promise<ParkingIncident> {
    return this.parkingService.resolveIncident(id, body.resolution);
  }

  @Delete('incidents/:id')
  @ApiOperation({
    summary: 'Delete Incident',
    description: 'Remove an incident from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Incident ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Incident deleted successfully',
    type: ParkingIncident,
  })
  @ApiResponse({
    status: 404,
    description: 'Incident not found',
  })
  deleteIncident(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ParkingIncident> {
    return this.parkingService.deleteIncident(id);
  }
}

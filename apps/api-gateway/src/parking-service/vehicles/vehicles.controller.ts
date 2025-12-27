import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { VehiclesService } from './vehicles.service';
import {
  CreateVehicleDto,
  GuestType,
  UpdateVehicleDto,
  VehicleDto,
  VehicleStatus,
} from '@app/contracts/parking-service';

@ApiTags('parking')
@Controller('parking/vehicles')
@AuditLog({ resource: AuditResource.PARKING })
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Vehicles',
    description:
      'Retrieve all registered vehicles in the parking system with their current status and assigned space information. Optionally filter by status or guest type.',
  })
  @ApiQuery({
    name: 'status',
    enum: VehicleStatus,
    required: false,
    description: 'Filter vehicles by their current parking status',
  })
  @ApiQuery({
    name: 'guestType',
    enum: GuestType,
    required: false,
    description: 'Filter vehicles by the type of guest',
  })
  @ApiResponse({ status: 200, type: [VehicleDto] })
  findAll(
    @Query('status') status?: VehicleStatus,
    @Query('guestType') guestType?: GuestType,
  ): Observable<VehicleDto[]> {
    return this.vehiclesService.findAll(status, guestType);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Vehicle by ID',
    description:
      'Retrieve a specific vehicle by its unique identifier, including its current status and assigned parking space.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the vehicle',
    example: 1,
  })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<VehicleDto> {
    return this.vehiclesService.findOne(id);
  }

  @Get('license/:licensePlate')
  @ApiOperation({
    summary: 'Get Vehicle by License Plate',
    description:
      'Retrieve a specific vehicle by its license plate number. Useful for quick lookups at parking entry/exit points.',
  })
  @ApiParam({
    name: 'licensePlate',
    type: String,
    description: 'License plate number of the vehicle',
    example: 'ABC-1234',
  })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({
    status: 404,
    description: 'Vehicle with the specified license plate not found',
  })
  findByLicensePlate(
    @Param('licensePlate') licensePlate: string,
  ): Observable<VehicleDto> {
    return this.vehiclesService.findByLicensePlate(licensePlate);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Vehicle',
    description:
      'Register a new vehicle in the parking system. The vehicle will be assigned a parking space if available.',
  })
  @ApiBody({
    type: CreateVehicleDto,
    description:
      'Vehicle registration data including license plate, owner information, and guest type',
  })
  @ApiResponse({ status: 201, type: VehicleDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(@Body() body: CreateVehicleDto): Observable<VehicleDto> {
    return this.vehiclesService.create(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Vehicle',
    description:
      'Update an existing vehicle record with new information such as owner details or assigned parking space.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the vehicle to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateVehicleDto,
    description: 'Updated vehicle data',
  })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVehicleDto,
  ): Observable<VehicleDto> {
    return this.vehiclesService.update(id, body);
  }

  @Patch(':id/checkout')
  @ApiOperation({
    summary: 'Check Out Vehicle',
    description:
      'Mark a vehicle as checked out from the parking facility. This frees up the assigned parking space.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the vehicle to check out',
    example: 1,
  })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  checkOut(@Param('id', ParseIntPipe) id: number): Observable<VehicleDto> {
    return this.vehiclesService.checkOut(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Vehicle',
    description:
      'Remove a vehicle record from the parking system. This should only be used for erroneous entries.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the vehicle to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<VehicleDto> {
    return this.vehiclesService.remove(id);
  }
}

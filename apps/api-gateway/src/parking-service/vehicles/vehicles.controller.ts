import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';
import { VehiclesService } from './vehicles.service';
import { VehicleDto } from '@app/contracts/parking-service/vehicles/dto/vehicle.dto';
import { CreateVehicleDto } from '@app/contracts/parking-service/vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '@app/contracts/parking-service/vehicles/dto/update-vehicle.dto';
import { VehicleStatus } from '@app/contracts/parking-service/vehicles/enums/vehicle-status.enum';
import { GuestType } from '@app/contracts/parking-service/vehicles/enums/guest-type.enum';

@ApiTags('parking')
@Controller('parking/vehicles')
@AuditLog({ resource: AuditResource.PARKING })
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Vehicles' })
  @ApiResponse({ status: 200, type: [VehicleDto] })
  getAllVehicles(): Observable<VehicleDto[]> {
    return this.vehiclesService.findAll();
  }

  @Get('by-status')
  @ApiOperation({ summary: 'Get Vehicles by Status' })
  @ApiQuery({ name: 'status', enum: VehicleStatus })
  @ApiResponse({ status: 200, type: [VehicleDto] })
  getVehiclesByStatus(
    @Query('status') status: VehicleStatus,
  ): Observable<VehicleDto[]> {
    return this.vehiclesService.findByStatus(status);
  }

  @Get('by-guest-type')
  @ApiOperation({ summary: 'Get Vehicles by Guest Type' })
  @ApiQuery({ name: 'guestType', enum: GuestType })
  @ApiResponse({ status: 200, type: [VehicleDto] })
  getVehiclesByGuestType(
    @Query('guestType') guestType: GuestType,
  ): Observable<VehicleDto[]> {
    return this.vehiclesService.findByGuestType(guestType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Vehicle by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: VehicleDto })
  getVehicleById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<VehicleDto> {
    return this.vehiclesService.findOne(id);
  }

  @Get('license/:licensePlate')
  @ApiOperation({ summary: 'Get Vehicle by License Plate' })
  @ApiParam({ name: 'licensePlate', type: String })
  @ApiResponse({ status: 200, type: VehicleDto })
  getVehicleByLicensePlate(
    @Param('licensePlate') licensePlate: string,
  ): Observable<VehicleDto> {
    return this.vehiclesService.findByLicensePlate(licensePlate);
  }

  @Post()
  @ApiOperation({ summary: 'Create Vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 201, type: VehicleDto })
  createVehicle(@Body() body: CreateVehicleDto): Observable<VehicleDto> {
    return this.vehiclesService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Vehicle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVehicleDto })
  @ApiResponse({ status: 200, type: VehicleDto })
  updateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVehicleDto,
  ): Observable<VehicleDto> {
    return this.vehiclesService.update(id, body);
  }

  @Put(':id/checkout')
  @ApiOperation({ summary: 'Check Out Vehicle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: VehicleDto })
  checkOutVehicle(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<VehicleDto> {
    return this.vehiclesService.checkOut(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Vehicle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: VehicleDto })
  deleteVehicle(@Param('id', ParseIntPipe) id: number): Observable<VehicleDto> {
    return this.vehiclesService.remove(id);
  }
}

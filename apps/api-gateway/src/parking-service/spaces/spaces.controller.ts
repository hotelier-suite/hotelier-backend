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
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import { SpacesService } from './spaces.service';
import {
  CreateParkingSpaceDto,
  ParkingSpaceDto,
  SpaceType,
  UpdateParkingSpaceDto,
} from '@app/contracts/parking-service';

@ApiTags('parking')
@Controller('parking/spaces')
@AuditLog({ resource: AuditResource.PARKING })
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Parking Spaces',
    description:
      'Retrieve all parking spaces in the facility with their current availability status and assigned vehicle information.',
  })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  findAll(): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'Get Available Spaces',
    description:
      'Retrieve all parking spaces that are currently unoccupied and available for assignment.',
  })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  findAvailable(): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findAvailable();
  }

  @Get('by-type')
  @ApiOperation({
    summary: 'Get Spaces by Type',
    description:
      'Retrieve all parking spaces filtered by their type (e.g., standard, handicapped, VIP, electric vehicle).',
  })
  @ApiQuery({
    name: 'type',
    enum: SpaceType,
    description: 'Filter parking spaces by their designated type',
  })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid space type value provided',
  })
  findByType(@Query('type') type: SpaceType): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findByType(type);
  }

  @Get('by-zone')
  @ApiOperation({
    summary: 'Get Spaces by Zone',
    description:
      'Retrieve all parking spaces within a specific zone or area of the parking facility.',
  })
  @ApiQuery({
    name: 'zone',
    type: String,
    description: 'Zone identifier to filter parking spaces (e.g., A, B, C)',
  })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  @ApiResponse({
    status: 400,
    description: 'Invalid zone value provided',
  })
  findByZone(@Query('zone') zone: string): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findByZone(zone);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Parking Space by ID',
    description:
      'Retrieve a specific parking space by its unique identifier, including its current status and assigned vehicle.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the parking space',
    example: 1,
  })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ParkingSpaceDto> {
    return this.spacesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Get Parking Space by Code',
    description:
      'Retrieve a specific parking space by its code (e.g., A-101). Useful for quick lookups by space label.',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Unique code/label of the parking space',
    example: 'A-101',
  })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  @ApiResponse({
    status: 404,
    description: 'Parking space with the specified code not found',
  })
  findByCode(@Param('code') code: string): Observable<ParkingSpaceDto> {
    return this.spacesService.findByCode(code);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Parking Space',
    description:
      'Create a new parking space in the facility with the specified type, zone, and code.',
  })
  @ApiBody({
    type: CreateParkingSpaceDto,
    description: 'Parking space data including code, type, and zone assignment',
  })
  @ApiResponse({ status: 201, type: ParkingSpaceDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(@Body() body: CreateParkingSpaceDto): Observable<ParkingSpaceDto> {
    return this.spacesService.create(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Parking Space',
    description:
      'Update an existing parking space with new information such as type, zone, or availability status.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the parking space to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateParkingSpaceDto,
    description: 'Updated parking space data',
  })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateParkingSpaceDto,
  ): Observable<ParkingSpaceDto> {
    return this.spacesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Parking Space',
    description:
      'Remove a parking space from the facility. This should only be used when a space is permanently decommissioned.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the parking space to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  @ApiResponse({
    status: 404,
    description: 'Parking space not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<ParkingSpaceDto> {
    return this.spacesService.remove(id);
  }
}

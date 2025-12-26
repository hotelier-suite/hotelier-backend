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
  @ApiOperation({ summary: 'Get All Parking Spaces' })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  getAllSpaces(): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get Available Spaces' })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  getAvailableSpaces(): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findAvailable();
  }

  @Get('by-type')
  @ApiOperation({ summary: 'Get Spaces by Type' })
  @ApiQuery({ name: 'type', enum: SpaceType })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  getSpacesByType(
    @Query('type') type: SpaceType,
  ): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findByType(type);
  }

  @Get('by-zone')
  @ApiOperation({ summary: 'Get Spaces by Zone' })
  @ApiQuery({ name: 'zone', type: String })
  @ApiResponse({ status: 200, type: [ParkingSpaceDto] })
  getSpacesByZone(@Query('zone') zone: string): Observable<ParkingSpaceDto[]> {
    return this.spacesService.findByZone(zone);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Parking Space by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  getSpaceById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingSpaceDto> {
    return this.spacesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get Parking Space by Code' })
  @ApiParam({ name: 'code', type: String })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  getSpaceByCode(@Param('code') code: string): Observable<ParkingSpaceDto> {
    return this.spacesService.findByCode(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create Parking Space' })
  @ApiBody({ type: CreateParkingSpaceDto })
  @ApiResponse({ status: 201, type: ParkingSpaceDto })
  createSpace(
    @Body() body: CreateParkingSpaceDto,
  ): Observable<ParkingSpaceDto> {
    return this.spacesService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Parking Space' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateParkingSpaceDto })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  updateSpace(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateParkingSpaceDto,
  ): Observable<ParkingSpaceDto> {
    return this.spacesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Parking Space' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ParkingSpaceDto })
  deleteSpace(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<ParkingSpaceDto> {
    return this.spacesService.remove(id);
  }
}

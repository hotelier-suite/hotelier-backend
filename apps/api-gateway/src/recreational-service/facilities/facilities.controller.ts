import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
  ParseDatePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FacilitiesService } from './facilities.service';
import {
  CreateRecreationalFacilityDto,
  FacilityAvailabilityDto,
  FacilityType,
  RecreationalFacilityDto,
  UpdateRecreationalFacilityDto,
} from '@app/contracts/recreational-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('recreational')
@Controller('recreational/facilities')
@AuditLog({ resource: AuditResource.RECREATIONAL })
@ApiBearerAuth()
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Recreational Facility',
    description: 'Create a new recreational facility (gym, pool, spa, etc.)',
  })
  @ApiResponse({
    status: 201,
    description: 'Facility created successfully',
    type: RecreationalFacilityDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation failed for facility details',
  })
  @ApiBody({
    type: CreateRecreationalFacilityDto,
    description:
      'Recreational facility creation data including name, type, capacity, and operating hours',
  })
  create(
    @Body() createFacilityDto: CreateRecreationalFacilityDto,
  ): Observable<RecreationalFacilityDto> {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Recreational Facilities',
    description:
      'Retrieve all recreational facilities with their current status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all recreational facilities',
    type: [RecreationalFacilityDto],
  })
  findAll(): Observable<RecreationalFacilityDto[]> {
    return this.facilitiesService.findAll();
  }

  @Get('available')
  @ApiOperation({
    summary: 'Get Available Facilities',
    description: 'Retrieve only available recreational facilities',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available recreational facilities',
    type: [RecreationalFacilityDto],
  })
  findAvailable(): Observable<RecreationalFacilityDto[]> {
    return this.facilitiesService.findAvailable();
  }

  @Get('by-type/:type')
  @ApiOperation({
    summary: 'Get Facilities by Type',
    description: 'Retrieve recreational facilities filtered by type',
  })
  @ApiParam({
    name: 'type',
    enum: FacilityType,
    description: 'Facility type to filter by',
    example: FacilityType.GYM,
  })
  @ApiResponse({
    status: 200,
    description: 'List of recreational facilities of the specified type',
    type: [RecreationalFacilityDto],
  })
  findByType(
    @Param('type') type: FacilityType,
  ): Observable<RecreationalFacilityDto[]> {
    return this.facilitiesService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Recreational Facility',
    description:
      'Get detailed information about a specific recreational facility',
  })
  @ApiResponse({
    status: 200,
    description: 'Recreational facility details',
    type: RecreationalFacilityDto,
  })
  @ApiResponse({
    status: 404,
    description:
      'Facility not found - no facility exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational facility',
    type: Number,
    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalFacilityDto> {
    return this.facilitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Recreational Facility',
    description: 'Update facility information, status, or operating hours',
  })
  @ApiResponse({
    status: 200,
    description: 'Facility updated successfully',
    type: RecreationalFacilityDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation failed for facility update',
  })
  @ApiResponse({
    status: 404,
    description:
      'Facility not found - no facility exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational facility to update',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateRecreationalFacilityDto,
    description:
      'Facility update data including name, status, capacity, or operating hours',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacilityDto: UpdateRecreationalFacilityDto,
  ): Observable<RecreationalFacilityDto> {
    return this.facilitiesService.update(id, updateFacilityDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Recreational Facility',
    description: 'Remove a recreational facility from the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Facility deleted successfully',
    type: RecreationalFacilityDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Cannot delete facility with active bookings - cancel or complete existing bookings first',
  })
  @ApiResponse({
    status: 404,
    description:
      'Facility not found - no facility exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational facility to delete',
    type: Number,
    example: 1,
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalFacilityDto> {
    return this.facilitiesService.remove(id);
  }

  @Get('availability')
  @ApiOperation({
    summary: 'Get Multiple Facilities Availability',
    description: 'Get availability for multiple facilities on a specific date',
  })
  @ApiResponse({
    status: 200,
    description: 'Multiple facilities availability information',
    type: [FacilityAvailabilityDto],
  })
  @ApiQuery({
    name: 'facilityIds',
    required: false,
    type: String,
    description:
      'Comma-separated facility IDs to check availability for. If not provided, returns availability for all facilities.',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Date to check availability in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-28',
  })
  getMultipleAvailability(
    @Query(
      'facilityIds',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    facilityIds: number[],
    @Query('date', ParseDatePipe) date: Date,
  ): Observable<FacilityAvailabilityDto[]> {
    return this.facilitiesService.getMultipleAvailability(facilityIds, date);
  }

  @Get(':id/availability')
  @ApiOperation({
    summary: 'Get Facility Availability',
    description: 'Get available time slots for a facility on a specific date',
  })
  @ApiResponse({
    status: 200,
    description: 'Facility availability information',
    type: FacilityAvailabilityDto,
  })
  @ApiResponse({
    status: 404,
    description:
      'Facility not found - no facility exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational facility',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Date to check availability in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-28',
  })
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('date', ParseDatePipe) date: Date,
  ): Observable<FacilityAvailabilityDto> {
    return this.facilitiesService.getAvailability(id, date);
  }
}

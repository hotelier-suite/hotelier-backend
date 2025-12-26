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
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateRecreationalFacilityDto })
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
  @ApiQuery({
    name: 'type',
    required: false,
    enum: FacilityType,
    description: 'Filter facilities by type',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    type: Boolean,
    description: 'Filter only available facilities',
  })
  findAll(
    @Query('type') type?: FacilityType,
    @Query('available') availableOnly?: boolean,
  ): Observable<RecreationalFacilityDto[]> {
    if (availableOnly) {
      return this.facilitiesService.findAvailable();
    }
    if (type) {
      return this.facilitiesService.findByType(type);
    }
    return this.facilitiesService.findAll();
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
    description: 'Facility not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Facility ID',
    type: Number,
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
    status: 404,
    description: 'Facility not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Facility ID',
    type: Number,
  })
  @ApiBody({ type: UpdateRecreationalFacilityDto })
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
    description: 'Cannot delete facility with active bookings',
  })
  @ApiResponse({
    status: 404,
    description: 'Facility not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Facility ID',
    type: Number,
  })
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalFacilityDto> {
    return this.facilitiesService.delete(id);
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
    description: 'Facility not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Facility ID',
    type: Number,
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Date to check availability (YYYY-MM-DD)',
  })
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ): Observable<FacilityAvailabilityDto> {
    return this.facilitiesService.getAvailability(id, date);
  }
}

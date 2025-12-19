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
import { RecreationalService } from './recreational.service';

import { CreateRecreationalFacilityDto } from './dto/create-recreational-facility.dto';
import { UpdateRecreationalFacilityDto } from './dto/update-recreational-facility.dto';
import { CreateRecreationalBookingDto } from './dto/create-recreational-booking.dto';
import { UpdateRecreationalBookingDto } from './dto/update-recreational-booking.dto';
import { FacilityAvailabilityDto } from './dto/facility-availability.dto';
import { BookingStatisticsDto } from './dto/booking-statistics.dto';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

import { RecreationalFacility } from './entities/recreational-facility.entity';
import { RecreationalBooking } from './entities/recreational-booking.entity';
import { FacilityType } from './enums/facility-type.enum';

@ApiTags('recreational')
@Controller('recreational')
@AuditLog({ resource: AuditResource.RECREATIONAL })
@ApiBearerAuth()
export class RecreationalController {
  constructor(private readonly recreationalService: RecreationalService) {}

  // Facility Management Endpoints
  @Post('facilities')
  @ApiOperation({
    summary: 'Create Recreational Facility',
    description: 'Create a new recreational facility (gym, pool, spa, etc.)',
  })
  @ApiResponse({
    status: 201,
    description: 'Facility created successfully',
    type: RecreationalFacility,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiBody({ type: CreateRecreationalFacilityDto })
  createFacility(
    @Body() createFacilityDto: CreateRecreationalFacilityDto,
  ): Promise<RecreationalFacility> {
    return this.recreationalService.createFacility(createFacilityDto);
  }

  @Get('facilities')
  @ApiOperation({
    summary: 'Get All Recreational Facilities',
    description:
      'Retrieve all recreational facilities with their current status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all recreational facilities',
    type: [RecreationalFacility],
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
  async getAllFacilities(
    @Query('type') type?: FacilityType,
    @Query('available') availableOnly?: boolean,
  ): Promise<RecreationalFacility[]> {
    if (availableOnly) {
      return this.recreationalService.getAvailableFacilities();
    }
    if (type) {
      return this.recreationalService.getFacilitiesByType(type);
    }
    return this.recreationalService.getAllFacilities();
  }

  @Get('facilities/:id')
  @ApiOperation({
    summary: 'Get Recreational Facility',
    description:
      'Get detailed information about a specific recreational facility',
  })
  @ApiResponse({
    status: 200,
    description: 'Recreational facility details',
    type: RecreationalFacility,
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
  getFacilityById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecreationalFacility> {
    return this.recreationalService.getFacilityById(id);
  }

  @Patch('facilities/:id')
  @ApiOperation({
    summary: 'Update Recreational Facility',
    description: 'Update facility information, status, or operating hours',
  })
  @ApiResponse({
    status: 200,
    description: 'Facility updated successfully',
    type: RecreationalFacility,
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
  updateFacility(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacilityDto: UpdateRecreationalFacilityDto,
  ): Promise<RecreationalFacility> {
    return this.recreationalService.updateFacility(id, updateFacilityDto);
  }

  @Delete('facilities/:id')
  @ApiOperation({
    summary: 'Delete Recreational Facility',
    description: 'Remove a recreational facility from the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Facility deleted successfully',
    type: RecreationalFacility,
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
  deleteFacility(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecreationalFacility> {
    return this.recreationalService.deleteFacility(id);
  }

  // Booking Management Endpoints
  @Post('bookings')
  @ApiOperation({
    summary: 'Create Recreational Booking',
    description: 'Create a new booking for a recreational facility',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking data or facility not available',
  })
  @ApiResponse({
    status: 409,
    description: 'Time slot already booked',
  })
  @ApiBody({ type: CreateRecreationalBookingDto })
  createBooking(
    @Body() createBookingDto: CreateRecreationalBookingDto,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.createBooking(createBookingDto);
  }

  @Get('bookings')
  @ApiOperation({
    summary: 'Get All Recreational Bookings',
    description: 'Retrieve all recreational bookings with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recreational bookings',
    type: [RecreationalBooking],
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Filter bookings by date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'facilityId',
    required: false,
    type: Number,
    description: 'Filter bookings by facility ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter bookings from start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter bookings until end date (YYYY-MM-DD)',
  })
  async getAllBookings(
    @Query('date') date?: string,
    @Query('facilityId') facilityIdParam?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<RecreationalBooking[]> {
    // Parse facilityId safely
    const facilityId = facilityIdParam
      ? parseInt(facilityIdParam, 10)
      : undefined;

    if (date) {
      return this.recreationalService.getBookingsByDate(new Date(date));
    }
    if (facilityId && !isNaN(facilityId)) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      return this.recreationalService.getBookingsByFacility(
        facilityId,
        start,
        end,
      );
    }
    return this.recreationalService.getAllBookings();
  }

  @Get('bookings/:id')
  @ApiOperation({
    summary: 'Get Recreational Booking',
    description: 'Get detailed information about a specific booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
  })
  getBookingById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.getBookingById(id);
  }

  @Patch('bookings/:id')
  @ApiOperation({
    summary: 'Update Recreational Booking',
    description: 'Update booking details, time, or status',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid update data or new time not available',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
  })
  @ApiBody({ type: UpdateRecreationalBookingDto })
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateRecreationalBookingDto,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.updateBooking(id, updateBookingDto);
  }

  @Patch('bookings/:id/cancel')
  @ApiOperation({
    summary: 'Cancel Recreational Booking',
    description: 'Cancel an existing booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel completed booking',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
  })
  @ApiQuery({
    name: 'reason',
    required: false,
    type: String,
    description: 'Cancellation reason',
  })
  cancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @Query('reason') reason?: string,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.cancelBooking(id, reason);
  }

  @Patch('bookings/:id/checkin')
  @ApiOperation({
    summary: 'Check In Recreational Booking',
    description: 'Check in a guest for their recreational facility booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest checked in successfully',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Only confirmed bookings can be checked in',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
  })
  checkInBooking(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.checkInBooking(id);
  }

  @Patch('bookings/:id/checkout')
  @ApiOperation({
    summary: 'Check Out Recreational Booking',
    description: 'Check out a guest from their recreational facility booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest checked out successfully',
    type: RecreationalBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Only checked-in bookings can be checked out',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    type: Number,
  })
  checkOutBooking(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RecreationalBooking> {
    return this.recreationalService.checkOutBooking(id);
  }

  // Availability Endpoints
  @Get('facilities/:id/availability')
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
  getFacilityAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ): Promise<FacilityAvailabilityDto> {
    return this.recreationalService.getFacilityAvailability(id, new Date(date));
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
    required: true,
    type: String,
    description: 'Comma-separated facility IDs (e.g., "1,2,3")',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Date to check availability (YYYY-MM-DD)',
  })
  getMultipleFacilitiesAvailability(
    @Query('facilityIds') facilityIds: string,
    @Query('date') date: string,
  ): Promise<FacilityAvailabilityDto[]> {
    const ids = facilityIds.split(',').map((id) => parseInt(id.trim(), 10));
    return this.recreationalService.getMultipleFacilitiesAvailability(
      ids,
      new Date(date),
    );
  }

  // Statistics and Reporting Endpoints
  @Get('statistics')
  @ApiOperation({
    summary: 'Get Booking Statistics',
    description:
      'Get comprehensive statistics about recreational facility bookings',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics and analytics',
    type: BookingStatisticsDto,
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Start date for statistics (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'End date for statistics (YYYY-MM-DD)',
  })
  getBookingStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<BookingStatisticsDto> {
    return this.recreationalService.getBookingStatistics(
      new Date(startDate),
      new Date(endDate),
    );
  }
}

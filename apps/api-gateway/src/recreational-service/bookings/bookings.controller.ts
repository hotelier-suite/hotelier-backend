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
import { BookingsService } from './bookings.service';
import {
  RecreationalBookingDto,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  BookingStatisticsDto,
} from '@app/contracts/recreational-service/bookings/dto';
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('recreational')
@Controller('recreational/bookings')
@AuditLog({ resource: AuditResource.RECREATIONAL })
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Recreational Booking',
    description: 'Create a new booking for a recreational facility',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: RecreationalBookingDto,
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
  create(
    @Body() createBookingDto: CreateRecreationalBookingDto,
  ): Observable<RecreationalBookingDto> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Recreational Bookings',
    description: 'Retrieve all recreational bookings with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recreational bookings',
    type: [RecreationalBookingDto],
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
  findAll(
    @Query('date') date?: string,
    @Query('facilityId') facilityIdParam?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Observable<RecreationalBookingDto[]> {
    const facilityId = facilityIdParam ? parseInt(facilityIdParam, 10) : undefined;

    if (date) {
      return this.bookingsService.findByDate(date);
    }
    if (facilityId && !isNaN(facilityId)) {
      return this.bookingsService.findByFacility(facilityId, startDate, endDate);
    }
    return this.bookingsService.findAll();
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get Booking Statistics',
    description: 'Get comprehensive statistics about recreational facility bookings',
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
  getStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Observable<BookingStatisticsDto> {
    return this.bookingsService.getStatistics(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Recreational Booking',
    description: 'Get detailed information about a specific booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    type: RecreationalBookingDto,
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
  findOne(@Param('id', ParseIntPipe) id: number): Observable<RecreationalBookingDto> {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Recreational Booking',
    description: 'Update booking details, time, or status',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: RecreationalBookingDto,
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateRecreationalBookingDto,
  ): Observable<RecreationalBookingDto> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Recreational Booking',
    description: 'Delete a recreational booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking deleted successfully',
    type: RecreationalBookingDto,
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
  delete(@Param('id', ParseIntPipe) id: number): Observable<RecreationalBookingDto> {
    return this.bookingsService.delete(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel Recreational Booking',
    description: 'Cancel an existing booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: RecreationalBookingDto,
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
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Query('reason') reason?: string,
  ): Observable<RecreationalBookingDto> {
    return this.bookingsService.cancel(id, reason);
  }

  @Patch(':id/checkin')
  @ApiOperation({
    summary: 'Check In Recreational Booking',
    description: 'Check in a guest for their recreational facility booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest checked in successfully',
    type: RecreationalBookingDto,
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
  checkIn(@Param('id', ParseIntPipe) id: number): Observable<RecreationalBookingDto> {
    return this.bookingsService.checkIn(id);
  }

  @Patch(':id/checkout')
  @ApiOperation({
    summary: 'Check Out Recreational Booking',
    description: 'Check out a guest from their recreational facility booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest checked out successfully',
    type: RecreationalBookingDto,
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
  checkOut(@Param('id', ParseIntPipe) id: number): Observable<RecreationalBookingDto> {
    return this.bookingsService.checkOut(id);
  }
}

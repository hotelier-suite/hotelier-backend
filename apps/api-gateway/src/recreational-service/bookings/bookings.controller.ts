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
import { BookingsService } from './bookings.service';
import {
  BookingStatisticsDto,
  CreateRecreationalBookingDto,
  RecreationalBookingDto,
  UpdateRecreationalBookingDto,
} from '@app/contracts/recreational-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

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
    description:
      'Invalid booking data - validation failed or facility not available at requested time',
  })
  @ApiResponse({
    status: 409,
    description:
      'Time slot conflict - the requested time slot is already booked',
  })
  @ApiBody({
    type: CreateRecreationalBookingDto,
    description:
      'Booking creation data including facility ID, guest information, date, and time slot',
  })
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
    description:
      'Filter bookings by specific date in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-28',
  })
  @ApiQuery({
    name: 'facilityId',
    required: false,
    type: Number,
    description: 'Filter bookings by recreational facility ID',
    example: 1,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description:
      'Filter bookings from this start date in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description:
      'Filter bookings until this end date in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  findAll(
    @Query('date', new ParseDatePipe({ optional: true })) date?: Date,
    @Query('facilityId', new ParseIntPipe({ optional: true }))
    facilityId?: number,
    @Query('startDate', new ParseDatePipe({ optional: true })) startDate?: Date,
    @Query('endDate', new ParseDatePipe({ optional: true })) endDate?: Date,
  ): Observable<RecreationalBookingDto[]> {
    if (date) {
      return this.bookingsService.findByDate(date);
    }
    if (facilityId) {
      return this.bookingsService.findByFacility(
        facilityId,
        startDate,
        endDate,
      );
    }
    return this.bookingsService.findAll();
  }

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
    description:
      'Start date for statistics period in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description:
      'End date for statistics period in ISO 8601 format (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  getStatistics(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
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
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking',
    type: Number,
    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalBookingDto> {
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
    description:
      'Invalid update data - validation failed or new time slot not available',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking to update',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateRecreationalBookingDto,
    description:
      'Booking update data including time slot, status, or guest information changes',
  })
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
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking to delete',
    type: Number,
    example: 1,
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalBookingDto> {
    return this.bookingsService.remove(id);
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
    description:
      'Cannot cancel booking - booking is already completed or cancelled',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking to cancel',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'reason',
    required: false,
    type: String,
    description: 'Optional reason for cancelling the booking',
    example: 'Guest requested cancellation',
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
    description: 'Cannot check in - only confirmed bookings can be checked in',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking to check in',
    type: Number,
    example: 1,
  })
  checkIn(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalBookingDto> {
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
    description:
      'Cannot check out - only checked-in bookings can be checked out',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found - no booking exists with the specified ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the recreational booking to check out',
    type: Number,
    example: 1,
  })
  checkOut(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RecreationalBookingDto> {
    return this.bookingsService.checkOut(id);
  }
}

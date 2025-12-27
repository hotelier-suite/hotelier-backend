import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { BookingsService } from './bookings.service';
import {
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

@ApiTags('event-bookings')
@Controller('event-bookings')
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Event Booking',
    description: 'Create a new event booking with venue.',
  })
  @ApiBody({
    description: 'Event booking creation data',
    type: CreateEventBookingDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Event booking created successfully',
    type: EventBookingDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() createBookingDto: CreateEventBookingDto,
  ): Observable<EventBookingDto> {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Event Bookings',
    description: 'Retrieve all event bookings with venue details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event bookings retrieved successfully',
    type: [EventBookingDto],
  })
  findAll(): Observable<EventBookingDto[]> {
    return this.bookingsService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get Upcoming Event Bookings',
    description: 'Retrieve all upcoming event bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming event bookings retrieved successfully',
    type: [EventBookingDto],
  })
  findUpcoming(): Observable<EventBookingDto[]> {
    return this.bookingsService.findUpcoming();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Event Booking by ID',
    description: 'Retrieve a specific event booking by ID with venue details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event booking ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event booking retrieved successfully',
    type: EventBookingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event booking not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<EventBookingDto> {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Event Booking',
    description: 'Update an existing event booking.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event booking ID',
    example: 1,
  })
  @ApiBody({
    description: 'Event booking update data',
    type: UpdateEventBookingDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Event booking updated successfully',
    type: EventBookingDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Event booking not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateEventBookingDto,
  ): Observable<EventBookingDto> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Event Booking',
    description: 'Delete an event booking.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event booking ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event booking deleted successfully',
    type: EventBookingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event booking not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<EventBookingDto> {
    return this.bookingsService.remove(id);
  }
}

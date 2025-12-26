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
import { EventsService } from './events.service';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

@ApiTags('events')
@Controller('events')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Event',
    description: 'Create a new event record.',
  })
  @ApiBody({
    description: 'Event creation data',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createEventDto: CreateEventDto): Observable<EventDto> {
    return this.eventsService.createEvent(createEventDto);
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
    return this.eventsService.findAllBookings();
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get Upcoming Events',
    description: 'Retrieve all upcoming event bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming events retrieved successfully',
    type: [EventBookingDto],
  })
  getUpcomingEvents(): Observable<EventBookingDto[]> {
    return this.eventsService.getUpcomingBookings();
  }

  @Get('events')
  @ApiOperation({
    summary: 'Get All Events',
    description: 'Retrieve all events without venue relations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [EventDto],
  })
  findAllEvents(): Observable<EventDto[]> {
    return this.eventsService.findAllEvents();
  }

  @Post('bookings')
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
  createBooking(
    @Body() createEventBookingDto: CreateEventBookingDto,
  ): Observable<EventBookingDto> {
    return this.eventsService.createBooking(createEventBookingDto);
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
    return this.eventsService.findOneBooking(id);
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
    @Body() updateEventBookingDto: UpdateEventBookingDto,
  ): Observable<EventBookingDto> {
    return this.eventsService.updateBooking(id, updateEventBookingDto);
  }

  @Patch('events/:id')
  @ApiOperation({
    summary: 'Update Event',
    description: 'Update an existing event.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 1,
  })
  @ApiBody({
    description: 'Event update data',
    type: UpdateEventDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Observable<EventDto> {
    return this.eventsService.updateEvent(id, updateEventDto);
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
    return this.eventsService.deleteBooking(id);
  }

  @Delete('events/:id')
  @ApiOperation({
    summary: 'Delete Event',
    description: 'Delete an event.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    type: EventDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  removeEvent(@Param('id', ParseIntPipe) id: number): Observable<EventDto> {
    return this.eventsService.deleteEvent(id);
  }
}

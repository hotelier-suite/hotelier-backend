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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventBookingDto } from './dto/create-event-booking.dto';
import { UpdateEventBookingDto } from './dto/update-event-booking.dto';
import { Event } from './entities/event.entity';
import { EventBooking } from './entities/event-booking.entity';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

@ApiTags('events')
@Controller('events')
@AuditLog({ resource: AuditResource.EVENT })
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
    type: Event,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Event Bookings',
    description: 'Retrieve all event bookings with venue details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event bookings retrieved successfully',
    type: [EventBooking],
  })
  findAll(): Promise<EventBooking[]> {
    return this.eventsService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get Upcoming Events',
    description: 'Retrieve all upcoming event bookings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming events retrieved successfully',
    type: [EventBooking],
  })
  getUpcomingEvents(): Promise<EventBooking[]> {
    return this.eventsService.getUpcomingEvents();
  }

  @Get('events')
  @ApiOperation({
    summary: 'Get All Events',
    description: 'Retrieve all events without venue relations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [Event],
  })
  findAllEvents(): Promise<Event[]> {
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
    type: EventBooking,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  createBooking(
    @Body() createEventBookingDto: CreateEventBookingDto,
  ): Promise<EventBooking> {
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
    type: EventBooking,
  })
  @ApiResponse({
    status: 404,
    description: 'Event booking not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EventBooking | null> {
    return this.eventsService.findOne(id);
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
    type: EventBooking,
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
  ): Promise<EventBooking> {
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
    type: Event,
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
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
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
    type: EventBooking,
  })
  @ApiResponse({
    status: 404,
    description: 'Event booking not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<EventBooking> {
    return this.eventsService.delete(id);
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
    type: Event,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  removeEvent(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventsService.deleteEvent(id);
  }
}

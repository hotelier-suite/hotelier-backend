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
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Events',
    description: 'Retrieve all events.',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [EventDto],
  })
  findAll(): Observable<EventDto[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Event by ID',
    description: 'Retrieve a specific event by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    type: EventDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<EventDto> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Observable<EventDto> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
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
  remove(@Param('id', ParseIntPipe) id: number): Observable<EventDto> {
    return this.eventsService.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { RoomsService } from './rooms.service';
import {
  CreateRoomDto,
  UpdateRoomDto,
  RoomDto,
  FindRoomsFilterDto,
} from '@app/contracts/booking-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.ROOM,
    description: 'Room created',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Create Room',
    description:
      'Create a new room in the hotel system with room number, type, floor, and pricing information. The room will be available for reservations once created.',
  })
  @ApiBody({
    description:
      'Room creation data including room number, type, floor, capacity, and base price',
    type: CreateRoomDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(@Body() createRoomDto: CreateRoomDto): Observable<RoomDto> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Rooms',
    description:
      'Retrieve all rooms in the hotel with optional filters. Filter by room type or availability status. Returns room details including type, capacity, and current availability.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
    type: [RoomDto],
  })
  findAll(@Query() filters: FindRoomsFilterDto): Observable<RoomDto[]> {
    return this.roomsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Room by ID',
    description:
      'Retrieve a specific room by its unique identifier. Returns complete room information including type, status, amenities, and pricing.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the room',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room retrieved successfully',
    type: RoomDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<RoomDto> {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.ROOM,
    description: 'Room updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Room',
    description:
      'Update an existing room with new information such as availability status, pricing, or amenities. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the room to update',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Room data to update including status, price, or amenities',
    type: UpdateRoomDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Observable<RoomDto> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.ROOM,
    description: 'Room deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Room',
    description:
      'Remove a room from the hotel system. This action may be restricted if the room has active or future reservations.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the room to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
    type: RoomDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<RoomDto> {
    return this.roomsService.remove(id);
  }
}

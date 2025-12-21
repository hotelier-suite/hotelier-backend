import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { CreateRoomDto } from '@app/contracts/booking-service/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '@app/contracts/booking-service/rooms/dto/update-room.dto';
import { RoomDto } from '@app/contracts/booking-service/rooms/dto/room.dto';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditAction } from '../../audit/enums/audit-action.enum';
import { AuditResource } from '../../audit/enums/audit-resource.enum';

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
    description: 'Create a new room in the hotel system.',
  })
  @ApiBody({
    description: 'Room creation data',
    type: CreateRoomDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() createRoomDto: CreateRoomDto): Observable<RoomDto> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Rooms',
    description: 'Retrieve all rooms sorted by room number.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rooms retrieved successfully',
    type: [RoomDto],
  })
  findAll(): Observable<RoomDto[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Room by ID',
    description: 'Retrieve a specific room by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
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
    description: 'Update an existing room (availability, price, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Room update data',
    type: UpdateRoomDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomDto,
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
    description: 'Delete a room from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
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

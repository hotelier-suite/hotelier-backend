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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditAction, AuditResource } from '@app/contracts/audit-service/enums';

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
    type: Room,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
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
    type: [Room],
  })
  findAll(): Promise<Room[]> {
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
    type: Room,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Room | null> {
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
    type: Room,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
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
    type: Room,
  })
  @ApiResponse({
    status: 404,
    description: 'Room not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return this.roomsService.delete(id);
  }
}

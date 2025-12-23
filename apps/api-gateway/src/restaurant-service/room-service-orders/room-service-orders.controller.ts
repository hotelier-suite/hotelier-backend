import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
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
import { RoomServiceOrdersService } from './room-service-orders.service';
import {
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
} from '@app/contracts/restaurant-service/room-service-orders/dto';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditResource } from '../../audit/enums/audit-resource.enum';

@ApiTags('restaurant')
@Controller('restaurant/room-service-orders')
@AuditLog({ resource: AuditResource.RESTAURANT })
@ApiBearerAuth()
export class RoomServiceOrdersController {
  constructor(private readonly roomServiceOrdersService: RoomServiceOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Room Service Orders',
    description:
      'Retrieve all room service orders sorted by creation date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Room service orders retrieved successfully',
    type: [RoomServiceOrderDto],
  })
  findAll(): Observable<RoomServiceOrderDto[]> {
    return this.roomServiceOrdersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Room Service Order by ID',
    description: 'Retrieve a specific room service order by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Room service order ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Room service order retrieved successfully',
    type: RoomServiceOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room service order not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Room Service Order',
    description:
      'Create a new room service order with automatic order number generation.',
  })
  @ApiBody({
    description: 'Room service order creation data',
    type: CreateRoomServiceOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Room service order created successfully',
    type: RoomServiceOrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(@Body() data: CreateRoomServiceOrderDto): Observable<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Room Service Order',
    description:
      'Update an existing room service order (status, waiter, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'Room service order ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: 'Room service order update data',
    type: UpdateRoomServiceOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Room service order updated successfully',
    type: RoomServiceOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Room service order not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoomServiceOrderDto,
  ): Observable<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.update(id, data);
  }
}

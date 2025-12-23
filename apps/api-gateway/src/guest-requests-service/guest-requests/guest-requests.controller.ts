import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { GuestRequestsService } from './guest-requests.service';
import { CreateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/create-guest-request.dto';
import { GuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/guest-request.dto';
import { UpdateGuestRequestDto } from '@app/contracts/guest-requests-service/guest-requests/dto/update-guest-request.dto';
import { RequestPriority } from '@app/contracts/guest-requests-service/guest-requests/enums/request-priority.enum';
import { RequestStatus } from '@app/contracts/guest-requests-service/guest-requests/enums/request-status.enum';
import { AuditLog } from '../../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';

@ApiTags('guest-requests')
@Controller('guest-requests')
@AuditLog({ resource: AuditResource.GUEST_REQUEST })
export class GuestRequestsController {
  constructor(private readonly guestRequestsService: GuestRequestsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Guest Request',
    description: 'Create a new guest request.',
  })
  @ApiBody({
    description: 'Guest request creation data',
    type: CreateGuestRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Guest request created successfully',
    type: GuestRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() createGuestRequestDto: CreateGuestRequestDto,
  ): Observable<GuestRequestDto> {
    return this.guestRequestsService.create(createGuestRequestDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Guest Requests',
    description: 'Retrieve all guest requests, optionally filtered by status.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RequestStatus,
    description: 'Filter requests by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest requests retrieved successfully',
    type: [GuestRequestDto],
  })
  findAll(
    @Query('status') status?: RequestStatus,
  ): Observable<GuestRequestDto[]> {
    if (status) {
      return this.guestRequestsService.findByStatus(status);
    }
    return this.guestRequestsService.findAll();
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Get Pending Requests',
    description: 'Retrieve all pending guest requests.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending requests retrieved successfully',
    type: [GuestRequestDto],
  })
  getPendingRequests(): Observable<GuestRequestDto[]> {
    return this.guestRequestsService.getPendingRequests();
  }

  @Get('priority/:priority')
  @ApiOperation({
    summary: 'Get Requests by Priority',
    description: 'Retrieve guest requests filtered by priority level.',
  })
  @ApiParam({
    name: 'priority',
    description: 'Request priority level',
    enum: RequestPriority,
    example: RequestPriority.HIGH,
  })
  @ApiResponse({
    status: 200,
    description: 'Requests by priority retrieved successfully',
    type: [GuestRequestDto],
  })
  getRequestsByPriority(
    @Param('priority') priority: RequestPriority,
  ): Observable<GuestRequestDto[]> {
    return this.guestRequestsService.getRequestsByPriority(priority);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Guest Request by ID',
    description: 'Retrieve a specific guest request by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Guest request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Guest request retrieved successfully',
    type: GuestRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Guest request not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<GuestRequestDto> {
    return this.guestRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Guest Request',
    description: 'Update an existing guest request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Guest request ID',
    example: 1,
  })
  @ApiBody({
    description: 'Guest request update data',
    type: UpdateGuestRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Guest request updated successfully',
    type: GuestRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Guest request not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuestRequestDto: UpdateGuestRequestDto,
  ): Observable<GuestRequestDto> {
    return this.guestRequestsService.update(id, updateGuestRequestDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Guest Request',
    description: 'Delete a guest request.',
  })
  @ApiParam({
    name: 'id',
    description: 'Guest request ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Guest request deleted successfully',
    type: GuestRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Guest request not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<GuestRequestDto> {
    return this.guestRequestsService.remove(id);
  }
}

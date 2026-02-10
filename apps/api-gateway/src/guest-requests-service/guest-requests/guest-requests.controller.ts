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
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { GuestRequestsService } from './guest-requests.service';
import {
  CreateGuestRequestDto,
  GuestRequestDto,
  UpdateGuestRequestDto,
  FindGuestRequestsFilterDto,
} from '@app/contracts/guest-requests-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

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
    description:
      'Retrieve all guest requests with optional filters for status, priority, and limit.',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest requests retrieved successfully',
    type: [GuestRequestDto],
  })
  findAll(
    @Query() filters: FindGuestRequestsFilterDto,
  ): Observable<GuestRequestDto[]> {
    return this.guestRequestsService.findAll(filters);
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

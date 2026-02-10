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
import { GuestsService } from './guests.service';
import {
  CreateGuestDto,
  UpdateGuestDto,
  GuestDto,
  ListGuestsQueryDto,
} from '@app/contracts/booking-service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('guests')
@ApiBearerAuth()
@Controller('guests')
@AuditLog({ resource: AuditResource.GUEST })
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @ApiOperation({
    summary: 'List guests',
    description:
      'Retrieve all guests registered in the system with optional filtering. Returns guest profiles including contact information and identification details.',
  })
  @ApiResponse({ status: 200, type: [GuestDto] })
  findAll(@Query() filters: ListGuestsQueryDto): Observable<GuestDto[]> {
    return this.guestsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get guest by ID',
    description:
      'Retrieve a specific guest profile by their unique identifier. Returns complete guest information including contact details and preferences.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the guest',
    example: 1,
  })
  @ApiResponse({ status: 200, type: GuestDto })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<GuestDto> {
    return this.guestsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create guest',
    description:
      'Register a new guest in the system with their personal and contact information. The guest profile can be associated with reservations.',
  })
  @ApiBody({
    description:
      'Guest registration data including personal and contact information',
    type: CreateGuestDto,
  })
  @ApiResponse({ status: 201, type: GuestDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  create(@Body() data: CreateGuestDto): Observable<GuestDto> {
    return this.guestsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update guest',
    description:
      'Update an existing guest profile with new information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the guest to update',
    example: 1,
  })
  @ApiBody({
    description: 'Guest data to update',
    type: UpdateGuestDto,
  })
  @ApiResponse({ status: 200, type: GuestDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateGuestDto,
  ): Observable<GuestDto> {
    return this.guestsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete guest',
    description:
      'Remove a guest profile from the system. This action may be restricted if the guest has active reservations.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the guest to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, type: GuestDto })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  remove(@Param('id', ParseIntPipe) id: number): Observable<GuestDto> {
    return this.guestsService.remove(id);
  }
}

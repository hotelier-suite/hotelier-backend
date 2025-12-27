import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseDatePipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  CheckoutReservationResponseDto,
  BookingChannel,
  RoomType,
  RoomDto,
} from '@app/contracts/booking-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

@ApiTags('reservations')
@Controller('reservations')
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('current')
  @ApiOperation({
    summary: 'Get current guests with active reservations',
    description:
      'Retrieve all reservations for guests currently checked in at the hotel.',
  })
  @ApiResponse({ status: 200, type: [ReservationDto] })
  findCurrent(): Observable<ReservationDto[]> {
    return this.reservationsService.findCurrent();
  }

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.RESERVATION,
    description: 'Reservation created',
    includeBody: true,
    includeResult: true,
  })
  @ApiOperation({
    summary: 'Create Reservation',
    description: 'Create a new hotel reservation.',
  })
  @ApiBody({
    description: 'Reservation data to create',
    type: CreateReservationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: ReservationDto,
  })
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Observable<ReservationDto> {
    return this.reservationsService.create(createReservationDto);
  }

  @Post('self')
  @ApiOperation({
    summary: 'Create My Reservation (self-service)',
    description:
      'Create a reservation using the authenticated user ID. No special permissions required.',
  })
  @ApiResponse({ status: 201, type: ReservationDto })
  createSelf(
    @Body() body: CreateReservationDto,
    @Req() req: Request & { user?: { id?: number } },
  ): Observable<ReservationDto> {
    const userId = req.user?.id;

    const payload: CreateReservationDto & {
      userId?: number;
      channel?: BookingChannel;
    } = {
      ...body,
      userId,
      channel:
        (body as CreateReservationDto & { channel?: BookingChannel }).channel ??
        BookingChannel.DIRECT,
    };

    return this.reservationsService.create(payload as CreateReservationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Reservations',
    description:
      'Retrieve all reservations with related guest, room, and user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully',
    type: [ReservationDto],
  })
  findAll(): Observable<ReservationDto[]> {
    return this.reservationsService.findAll();
  }

  @Get('billing-details')
  @ApiOperation({
    summary: 'Get Reservations with Billing Details',
    description:
      'Retrieve active reservations with complete billing information including room charges, room service, and events.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservations with billing details retrieved successfully',
  })
  getReservationsWithBillingDetails(): Promise<any[]> {
    return this.reservationsService.getReservationsWithBillingDetails();
  }

  @Get('availability')
  @ApiOperation({
    summary: 'Get Room Availability',
    description:
      'Retrieve available rooms for a given date range, with optional filters for room type and minimum capacity.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (ISO 8601)',
    example: '2025-09-20',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (ISO 8601)',
    example: '2025-09-23',
    required: true,
  })
  @ApiQuery({
    name: 'type',
    description: 'Optional room type to filter',
    enum: RoomType,
    required: false,
  })
  @ApiQuery({
    name: 'guests',
    description: 'Optional minimum capacity (number of guests)',
    required: false,
    example: 2,
  })
  @ApiResponse({ status: 200, description: 'Available rooms', type: [RoomDto] })
  getAvailability(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('type') type?: RoomType,
    @Query('guests', new ParseIntPipe({ optional: true })) guests?: number,
  ): Observable<RoomDto[]> {
    return this.reservationsService.getAvailability({
      startDate,
      endDate,
      type,
      guests,
    });
  }

  @Get('mine')
  @ApiOperation({
    summary: 'Get My Reservations',
    description:
      'Retrieve all reservations for the currently authenticated user.',
  })
  @ApiResponse({ status: 200, type: [ReservationDto] })
  findMine(
    @Req() req: Request & { user?: { id?: number } },
  ): Observable<ReservationDto[]> {
    const userId = req.user?.id;
    return this.reservationsService.findMine(userId!);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Reservation by ID',
    description: 'Retrieve a specific reservation by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Reservation ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully',
    type: ReservationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ReservationDto> {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.RESERVATION,
    description: 'Reservation updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Reservation',
    description: 'Update an existing reservation.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Reservation ID',
    example: 1,
  })
  @ApiBody({
    description: 'Reservation updates',
    type: UpdateReservationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: ReservationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Observable<ReservationDto> {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.RESERVATION,
    description: 'Reservation deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Reservation',
    description: 'Delete a reservation.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Reservation ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation deleted successfully',
    type: ReservationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<ReservationDto> {
    return this.reservationsService.remove(id);
  }

  @Patch(':id/checkout')
  @AuditLog({
    action: AuditAction.CHECK_OUT,
    resource: AuditResource.RESERVATION,
    description: 'Reservation checked out',
    resourceIdParam: 'id',
    includeResult: true,
  })
  @ApiOperation({
    summary: 'Checkout Reservation',
    description:
      'Mark the reservation as CHECKED_OUT, block the room for cleaning, and create a cleaning assignment.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Reservation ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation checked out and cleaning queued',
    type: CheckoutReservationResponseDto,
  })
  checkout(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CheckoutReservationResponseDto> {
    return this.reservationsService.checkout(id);
  }
}

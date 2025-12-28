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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AttendanceService } from './attendance.service';
import {
  AttendanceDto,
  FindAttendanceFilterDto,
  UpdateAttendanceDto,
  CreateAttendanceDto,
  CheckInDto,
  CheckOutDto,
} from '@app/contracts/staff-service';
import { AuditLog } from '../../audit-service';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Attendance Records',
    description:
      'Retrieve all attendance records with employee information. Optionally filter by employee ID, date, date range, or status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
    type: [AttendanceDto],
  })
  findAll(
    @Query() filters: FindAttendanceFilterDto,
  ): Observable<AttendanceDto[]> {
    return this.attendanceService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Attendance Record by ID',
    description: 'Retrieve a specific attendance record by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Attendance record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance record retrieved successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendance record not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<AttendanceDto> {
    return this.attendanceService.findOne(id);
  }

  @Post()
  @AuditLog({
    action: AuditAction.CREATE,
    resource: AuditResource.ATTENDANCE,
    description: 'Attendance record created',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Create Attendance Record',
    description: 'Create a new attendance record for an employee.',
  })
  @ApiBody({
    description: 'Attendance record data',
    type: CreateAttendanceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Attendance record created successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() data: CreateAttendanceDto): Observable<AttendanceDto> {
    return this.attendanceService.create(data);
  }

  @Patch(':id')
  @AuditLog({
    action: AuditAction.UPDATE,
    resource: AuditResource.ATTENDANCE,
    description: 'Attendance record updated',
    resourceIdParam: 'id',
    includeBody: true,
  })
  @ApiOperation({
    summary: 'Update Attendance Record',
    description: 'Update an existing attendance record.',
  })
  @ApiParam({
    name: 'id',
    description: 'Attendance record ID',
    example: 1,
  })
  @ApiBody({
    description: 'Attendance record update data',
    type: UpdateAttendanceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance record updated successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendance record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAttendanceDto,
  ): Observable<AttendanceDto> {
    return this.attendanceService.update(id, data);
  }

  @Delete(':id')
  @AuditLog({
    action: AuditAction.DELETE,
    resource: AuditResource.ATTENDANCE,
    description: 'Attendance record deleted',
    resourceIdParam: 'id',
  })
  @ApiOperation({
    summary: 'Delete Attendance Record',
    description: 'Delete an attendance record by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Attendance record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance record deleted successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attendance record not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<AttendanceDto> {
    return this.attendanceService.remove(id);
  }

  @Post('check-in/:employeeId')
  @AuditLog({
    action: AuditAction.CHECK_IN,
    resource: AuditResource.ATTENDANCE,
    description: 'Employee checked in',
    resourceIdParam: 'employeeId',
  })
  @ApiOperation({
    summary: 'Employee Check-In',
    description: 'Record employee check-in for today with specified time.',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    example: 123,
  })
  @ApiBody({
    description: 'Check-in time data',
    type: CheckInDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Employee checked in successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid employee ID or time format',
  })
  checkIn(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() checkInData: CheckInDto,
  ): Observable<AttendanceDto> {
    return this.attendanceService.checkIn(employeeId, checkInData.time);
  }

  @Post('check-out/:employeeId')
  @AuditLog({
    action: AuditAction.CHECK_OUT,
    resource: AuditResource.ATTENDANCE,
    description: 'Employee checked out',
    resourceIdParam: 'employeeId',
  })
  @ApiOperation({
    summary: 'Employee Check-Out',
    description:
      'Record employee check-out for today and calculate hours worked.',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    example: 123,
  })
  @ApiBody({
    description: 'Check-out time data',
    type: CheckOutDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Employee checked out successfully',
    type: AttendanceDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid employee ID, time format, or no check-in found',
  })
  checkOut(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() checkOutData: CheckOutDto,
  ): Observable<AttendanceDto> {
    return this.attendanceService.checkOut(employeeId, checkOutData.time);
  }
}

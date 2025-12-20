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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from '@app/contracts/staff-service/attendance/dto/attendance.dto';
import { AttendanceStatus } from '@app/contracts/staff-service/attendance/enums/attendance-status.enum';
import { UpdateAttendanceDto } from '@app/contracts/staff-service/attendance/dto/update-attendance.dto';
import { CreateAttendanceDto } from '@app/contracts/staff-service/attendance/dto/create-attendance.dto';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditAction } from '../../audit/enums/audit-action.enum';
import { AuditResource } from '../../audit/enums/audit-resource.enum';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Attendance Records',
    description: 'Retrieve all attendance records with employee information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
    type: [AttendanceDto],
  })
  findAll(): Observable<AttendanceDto[]> {
    return this.attendanceService.findAll();
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

  @Get('employee/:employeeId')
  @ApiOperation({
    summary: 'Get Attendance Records by Employee',
    description: 'Retrieve all attendance records for a specific employee.',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee attendance records retrieved successfully',
    type: [AttendanceDto],
  })
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Observable<AttendanceDto[]> {
    return this.attendanceService.findByEmployee(employeeId);
  }

  @Get('date/:date')
  @ApiOperation({
    summary: 'Get Attendance Records by Date',
    description: 'Retrieve all attendance records for a specific date.',
  })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records for the date retrieved successfully',
    type: [AttendanceDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format',
  })
  findByDate(@Param('date') date: string): Observable<AttendanceDto[]> {
    return this.attendanceService.findByDate(new Date(date));
  }

  @Get('range/:startDate/:endDate')
  @ApiOperation({
    summary: 'Get Attendance Records by Date Range',
    description:
      'Retrieve all attendance records within a specified date range.',
  })
  @ApiParam({
    name: 'startDate',
    description: 'Start date in YYYY-MM-DD format',
    example: '2024-01-01',
  })
  @ApiParam({
    name: 'endDate',
    description: 'End date in YYYY-MM-DD format',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records for the date range retrieved successfully',
    type: [AttendanceDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format',
  })
  findByDateRange(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ): Observable<AttendanceDto[]> {
    return this.attendanceService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get Attendance Records by Status',
    description: 'Retrieve all attendance records with a specific status.',
  })
  @ApiParam({
    name: 'status',
    description: 'Attendance status',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance records with the status retrieved successfully',
    type: [AttendanceDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value',
  })
  findByStatus(
    @Param('status') status: AttendanceStatus,
  ): Observable<AttendanceDto[]> {
    return this.attendanceService.findByStatus(status);
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
    @Body() checkInData: { time: string },
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
    @Body() checkOutData: { time: string },
  ): Observable<AttendanceDto> {
    return this.attendanceService.checkOut(employeeId, checkOutData.time);
  }
}

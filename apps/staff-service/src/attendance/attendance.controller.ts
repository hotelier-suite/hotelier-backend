import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ATTENDANCE_PATTERNS } from '@app/contracts/staff-service/attendance/attendance.patterns';
import { AttendanceDto } from '@app/contracts/staff-service/attendance/dto/attendance.dto';
import { CreateAttendanceDto } from '@app/contracts/staff-service/attendance/dto/create-attendance.dto';
import { UpdateAttendanceDto } from '@app/contracts/staff-service/attendance/dto/update-attendance.dto';
import { AttendanceStatus } from '@app/contracts/staff-service/attendance/enums/attendance-status.enum';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_ALL)
  findAll(): Promise<AttendanceDto[]> {
    return this.attendanceService.findAll();
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<AttendanceDto> {
    return this.attendanceService.findOne(id);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_BY_EMPLOYEE)
  findByEmployee(@Payload() employeeId: number): Promise<AttendanceDto[]> {
    return this.attendanceService.findByEmployee(employeeId);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_BY_DATE)
  findByDate(@Payload() date: string | Date): Promise<AttendanceDto[]> {
    return this.attendanceService.findByDate(date);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_BY_DATE_RANGE)
  findByDateRange(
    @Payload() payload: { startDate: string | Date; endDate: string | Date },
  ): Promise<AttendanceDto[]> {
    return this.attendanceService.findByDateRange(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_BY_STATUS)
  findByStatus(@Payload() status: AttendanceStatus): Promise<AttendanceDto[]> {
    return this.attendanceService.findByStatus(status);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.CREATE)
  create(@Payload() data: CreateAttendanceDto): Promise<AttendanceDto> {
    return this.attendanceService.create(data);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateAttendanceDto },
  ): Promise<AttendanceDto> {
    return this.attendanceService.update(payload.id, payload.data);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<AttendanceDto> {
    return this.attendanceService.remove(id);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.CHECK_IN)
  checkIn(
    @Payload() payload: { employeeId: number; time: string },
  ): Promise<AttendanceDto> {
    return this.attendanceService.checkIn(payload.employeeId, payload.time);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.CHECK_OUT)
  checkOut(
    @Payload() payload: { employeeId: number; time: string },
  ): Promise<AttendanceDto> {
    return this.attendanceService.checkOut(payload.employeeId, payload.time);
  }
}

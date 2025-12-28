import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import {
  ATTENDANCE_PATTERNS,
  AttendanceDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  FindAttendanceFilterDto,
} from '@app/contracts/staff-service';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: FindAttendanceFilterDto,
  ): Promise<AttendanceDto[]> {
    return this.attendanceService.findAll(filters);
  }

  @MessagePattern(ATTENDANCE_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<AttendanceDto> {
    return this.attendanceService.findOne(id);
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

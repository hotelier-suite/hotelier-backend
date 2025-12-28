import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  ATTENDANCE_PATTERNS,
  AttendanceDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  FindAttendanceFilterDto,
} from '@app/contracts/staff-service';
import { STAFF_SERVICE_CLIENT } from '../constants';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(STAFF_SERVICE_CLIENT)
    private readonly staffClient: ClientProxy,
  ) {}

  findAll(filters: FindAttendanceFilterDto): Observable<AttendanceDto[]> {
    return this.staffClient.send<AttendanceDto[], FindAttendanceFilterDto>(
      ATTENDANCE_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<AttendanceDto> {
    return this.staffClient.send<AttendanceDto, number>(
      ATTENDANCE_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateAttendanceDto): Observable<AttendanceDto> {
    return this.staffClient.send<AttendanceDto, CreateAttendanceDto>(
      ATTENDANCE_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateAttendanceDto): Observable<AttendanceDto> {
    return this.staffClient.send<
      AttendanceDto,
      { id: number; data: UpdateAttendanceDto }
    >(ATTENDANCE_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<AttendanceDto> {
    return this.staffClient.send<AttendanceDto, number>(
      ATTENDANCE_PATTERNS.DELETE,
      id,
    );
  }

  checkIn(employeeId: number, time: string): Observable<AttendanceDto> {
    return this.staffClient.send<
      AttendanceDto,
      { employeeId: number; time: string }
    >(ATTENDANCE_PATTERNS.CHECK_IN, { employeeId, time });
  }

  checkOut(employeeId: number, time: string): Observable<AttendanceDto> {
    return this.staffClient.send<
      AttendanceDto,
      { employeeId: number; time: string }
    >(ATTENDANCE_PATTERNS.CHECK_OUT, { employeeId, time });
  }
}

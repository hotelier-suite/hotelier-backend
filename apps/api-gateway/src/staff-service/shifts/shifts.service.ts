import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SHIFTS_PATTERNS,
  ShiftDto,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftStatus,
} from '@app/contracts/staff-service';
import { STAFF_SERVICE_CLIENT } from '../constants';

@Injectable()
export class ShiftsService {
  constructor(
    @Inject(STAFF_SERVICE_CLIENT)
    private readonly staffClient: ClientProxy,
  ) {}

  findAll(): Observable<ShiftDto[]> {
    return this.staffClient.send<ShiftDto[], Record<string, never>>(
      SHIFTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<ShiftDto> {
    return this.staffClient.send<ShiftDto, number>(
      SHIFTS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  findByEmployee(employeeId: number): Observable<ShiftDto[]> {
    return this.staffClient.send<ShiftDto[], number>(
      SHIFTS_PATTERNS.FIND_BY_EMPLOYEE,
      employeeId,
    );
  }

  findByDate(date: string | Date): Observable<ShiftDto[]> {
    return this.staffClient.send<ShiftDto[], string | Date>(
      SHIFTS_PATTERNS.FIND_BY_DATE,
      date,
    );
  }

  findByDateRange(
    startDate: string | Date,
    endDate: string | Date,
  ): Observable<ShiftDto[]> {
    return this.staffClient.send<
      ShiftDto[],
      { startDate: string | Date; endDate: string | Date }
    >(SHIFTS_PATTERNS.FIND_BY_DATE_RANGE, { startDate, endDate });
  }

  findByStatus(status: ShiftStatus): Observable<ShiftDto[]> {
    return this.staffClient.send<ShiftDto[], ShiftStatus>(
      SHIFTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  create(data: CreateShiftDto): Observable<ShiftDto> {
    return this.staffClient.send<ShiftDto, CreateShiftDto>(
      SHIFTS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateShiftDto): Observable<ShiftDto> {
    return this.staffClient.send<
      ShiftDto,
      { id: number; data: UpdateShiftDto }
    >(SHIFTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<ShiftDto> {
    return this.staffClient.send<ShiftDto, number>(SHIFTS_PATTERNS.DELETE, id);
  }
}

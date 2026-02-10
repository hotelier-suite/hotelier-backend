import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  SHIFTS_PATTERNS,
  ShiftDto,
  CreateShiftDto,
  UpdateShiftDto,
  FindShiftsFilterDto,
} from '@app/contracts/staff-service';
import { STAFF_SERVICE_CLIENT } from '../constants';

@Injectable()
export class ShiftsService {
  constructor(
    @Inject(STAFF_SERVICE_CLIENT)
    private readonly staffClient: ClientProxy,
  ) {}

  findAll(filters: FindShiftsFilterDto): Observable<ShiftDto[]> {
    return this.staffClient.send<ShiftDto[], FindShiftsFilterDto>(
      SHIFTS_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<ShiftDto> {
    return this.staffClient.send<ShiftDto, number>(
      SHIFTS_PATTERNS.FIND_ONE,
      id,
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

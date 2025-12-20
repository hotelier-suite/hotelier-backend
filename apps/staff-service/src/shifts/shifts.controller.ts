import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SHIFTS_PATTERNS } from '@app/contracts/staff-service/shifts/shifts.patterns';
import { ShiftDto } from '@app/contracts/staff-service/shifts/dto/shift.dto';
import { CreateShiftDto } from '@app/contracts/staff-service/shifts/dto/create-shift.dto';
import { UpdateShiftDto } from '@app/contracts/staff-service/shifts/dto/update-shift.dto';
import { ShiftStatus } from '@app/contracts/staff-service/shifts/enums/shift-status.enum';
import { ShiftsService } from './shifts.service';

@Controller()
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @MessagePattern(SHIFTS_PATTERNS.FIND_ALL)
  findAll(): Promise<ShiftDto[]> {
    return this.shiftsService.findAll();
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_BY_ID)
  findOne(@Payload() id: number): Promise<ShiftDto> {
    return this.shiftsService.findOne(id);
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_BY_EMPLOYEE)
  findByEmployee(@Payload() employeeId: number): Promise<ShiftDto[]> {
    return this.shiftsService.findByEmployee(employeeId);
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_BY_DATE)
  findByDate(@Payload() date: string | Date): Promise<ShiftDto[]> {
    return this.shiftsService.findByDate(date);
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_BY_DATE_RANGE)
  findByDateRange(
    @Payload() payload: { startDate: string | Date; endDate: string | Date },
  ): Promise<ShiftDto[]> {
    return this.shiftsService.findByDateRange(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_BY_STATUS)
  findByStatus(@Payload() status: ShiftStatus): Promise<ShiftDto[]> {
    return this.shiftsService.findByStatus(status);
  }

  @MessagePattern(SHIFTS_PATTERNS.CREATE)
  create(@Payload() data: CreateShiftDto): Promise<ShiftDto> {
    return this.shiftsService.create(data);
  }

  @MessagePattern(SHIFTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateShiftDto },
  ): Promise<ShiftDto> {
    return this.shiftsService.update(payload.id, payload.data);
  }

  @MessagePattern(SHIFTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<ShiftDto> {
    return this.shiftsService.remove(id);
  }
}

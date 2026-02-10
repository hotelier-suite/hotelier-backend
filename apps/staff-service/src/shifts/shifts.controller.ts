import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  SHIFTS_PATTERNS,
  ShiftDto,
  CreateShiftDto,
  UpdateShiftDto,
  FindShiftsFilterDto,
} from '@app/contracts/staff-service';
import { ShiftsService } from './shifts.service';

@Controller()
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @MessagePattern(SHIFTS_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindShiftsFilterDto): Promise<ShiftDto[]> {
    return this.shiftsService.findAll(filters);
  }

  @MessagePattern(SHIFTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<ShiftDto> {
    return this.shiftsService.findOne(id);
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

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CleaningAssignmentsService } from './cleaning-assignments.service';
import {
  CLEANING_ASSIGNMENTS_PATTERNS,
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
} from '@app/contracts/operations-service';

@Controller()
export class CleaningAssignmentsController {
  constructor(
    private readonly cleaningAssignmentsService: CleaningAssignmentsService,
  ) {}

  @MessagePattern(CLEANING_ASSIGNMENTS_PATTERNS.FIND_ALL)
  findAll(): Promise<CleaningAssignmentDto[]> {
    return this.cleaningAssignmentsService.findAll();
  }

  @MessagePattern(CLEANING_ASSIGNMENTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.findOne(id);
  }

  @MessagePattern(CLEANING_ASSIGNMENTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateCleaningAssignmentDto,
  ): Promise<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.create(data);
  }

  @MessagePattern(CLEANING_ASSIGNMENTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateCleaningAssignmentDto },
  ): Promise<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.update(payload.id, payload.data);
  }

  @MessagePattern(CLEANING_ASSIGNMENTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.remove(id);
  }
}

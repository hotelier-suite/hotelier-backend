import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CleaningTasksService } from './cleaning-tasks.service';
import {
  CLEANING_TASKS_PATTERNS,
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
} from '@app/contracts/operations-service';

@Controller()
export class CleaningTasksController {
  constructor(private readonly cleaningTasksService: CleaningTasksService) {}

  @MessagePattern(CLEANING_TASKS_PATTERNS.FIND_ALL)
  findAll(): Promise<CleaningTaskDto[]> {
    return this.cleaningTasksService.findAll();
  }

  @MessagePattern(CLEANING_TASKS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<CleaningTaskDto> {
    return this.cleaningTasksService.findOne(id);
  }

  @MessagePattern(CLEANING_TASKS_PATTERNS.CREATE)
  create(@Payload() data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    return this.cleaningTasksService.create(data);
  }

  @MessagePattern(CLEANING_TASKS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateCleaningTaskDto },
  ): Promise<CleaningTaskDto> {
    return this.cleaningTasksService.update(payload.id, payload.data);
  }

  @MessagePattern(CLEANING_TASKS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<CleaningTaskDto> {
    return this.cleaningTasksService.remove(id);
  }
}

import { OmitType } from '@nestjs/swagger';
import { CleaningTask } from '../entities/cleaning-task.entity';

export class CreateCleaningTaskDto extends OmitType(CleaningTask, [
  'id',
  'status',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
  'room',
]) {}

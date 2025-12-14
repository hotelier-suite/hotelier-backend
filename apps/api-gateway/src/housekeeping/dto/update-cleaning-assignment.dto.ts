import { PartialType } from '@nestjs/swagger';
import { CreateCleaningAssignmentDto } from './create-cleaning-assignment.dto';
import { CleaningStatus } from '../enums/cleaning-status.enum';

export class UpdateCleaningAssignmentDto extends PartialType(
  CreateCleaningAssignmentDto,
) {
  status?: CleaningStatus;
  startedAt?: Date;
  completedAt?: Date;
  qualityScore?: number;
  notes?: string;
}

import { OmitType } from '@nestjs/swagger';
import { CleaningAssignment } from '../entities/cleaning-assignment.entity';

export class CreateCleaningAssignmentDto extends OmitType(CleaningAssignment, [
  'id',
  'assignedDate',
  'startedAt',
  'completedAt',
  'status',
  'qualityScore',
  'createdAt',
  'updatedAt',
  'room',
]) {}

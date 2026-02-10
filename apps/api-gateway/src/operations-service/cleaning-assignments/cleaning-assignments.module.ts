import { Module } from '@nestjs/common';
import { CleaningAssignmentsController } from './cleaning-assignments.controller';
import { CleaningAssignmentsService } from './cleaning-assignments.service';

@Module({
  controllers: [CleaningAssignmentsController],
  providers: [CleaningAssignmentsService],
  exports: [CleaningAssignmentsService],
})
export class CleaningAssignmentsModule {}

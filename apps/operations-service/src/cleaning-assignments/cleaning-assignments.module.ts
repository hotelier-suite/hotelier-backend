import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningAssignmentsController } from './cleaning-assignments.controller';
import { CleaningAssignmentsService } from './cleaning-assignments.service';
import { CleaningAssignment } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CleaningAssignment])],
  controllers: [CleaningAssignmentsController],
  providers: [CleaningAssignmentsService],
  exports: [CleaningAssignmentsService],
})
export class CleaningAssignmentsModule {}

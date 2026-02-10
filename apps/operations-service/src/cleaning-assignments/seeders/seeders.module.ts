import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningAssignment } from '../entities';
import { CleaningAssignmentsSeeder } from './cleaning-assignments.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([CleaningAssignment])],
  providers: [CleaningAssignmentsSeeder],
  exports: [CleaningAssignmentsSeeder],
})
export class CleaningAssignmentsSeedersModule {}

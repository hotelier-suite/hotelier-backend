import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningTask } from '../entities';
import { CleaningTasksSeeder } from './cleaning-tasks.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([CleaningTask])],
  providers: [CleaningTasksSeeder],
  exports: [CleaningTasksSeeder],
})
export class CleaningTasksSeedersModule {}

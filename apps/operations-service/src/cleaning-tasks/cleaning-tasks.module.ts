import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningTasksController } from './cleaning-tasks.controller';
import { CleaningTasksService } from './cleaning-tasks.service';
import { CleaningTask } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CleaningTask])],
  controllers: [CleaningTasksController],
  providers: [CleaningTasksService],
  exports: [CleaningTasksService],
})
export class CleaningTasksModule {}

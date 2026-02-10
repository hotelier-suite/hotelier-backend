import { Module } from '@nestjs/common';
import { CleaningTasksController } from './cleaning-tasks.controller';
import { CleaningTasksService } from './cleaning-tasks.service';

@Module({
  controllers: [CleaningTasksController],
  providers: [CleaningTasksService],
  exports: [CleaningTasksService],
})
export class CleaningTasksModule {}

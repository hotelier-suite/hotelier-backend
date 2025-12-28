import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from './entities';
import {
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
  CleaningStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class CleaningTasksService {
  constructor(
    @InjectRepository(CleaningTask)
    private readonly taskRepository: Repository<CleaningTask>,
  ) {}

  findAll(): Promise<CleaningTaskDto[]> {
    return this.taskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<CleaningTaskDto> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new RpcException({
        statusCode: 404,
        message: `Cleaning task with id ${id} not found`,
      });
    }
    return task;
  }

  create(data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    const task = this.taskRepository.create({
      ...data,
      status: CleaningStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
    });
    return this.taskRepository.save(task);
  }

  async update(
    id: number,
    data: UpdateCleaningTaskDto,
  ): Promise<CleaningTaskDto> {
    await this.findOne(id);
    await this.taskRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<CleaningTaskDto> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task as CleaningTask);
    return task;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CleaningTasksService } from './cleaning-tasks.service';
import {
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
} from '@app/contracts/operations-service';

@ApiTags('Cleaning Tasks')
@Controller('housekeeping/tasks')
@ApiBearerAuth()
export class CleaningTasksController {
  constructor(private readonly cleaningTasksService: CleaningTasksService) {}

  @ApiOperation({
    summary: 'Get all cleaning tasks',
    description:
      'Retrieve all cleaning tasks in the housekeeping system. Returns a list of tasks with their descriptions, priorities, and completion status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning tasks',
    type: [CleaningTaskDto],
  })
  @Get()
  findAll(): Observable<CleaningTaskDto[]> {
    return this.cleaningTasksService.findAll();
  }

  @ApiOperation({
    summary: 'Get cleaning task by ID',
    description:
      'Retrieve a specific cleaning task by its unique identifier. Returns detailed information about the task including its description, priority, and status.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning task',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning task',
    type: CleaningTaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning task not found with the specified ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new cleaning task',
    description:
      'Create a new cleaning task in the housekeeping system. Tasks define specific cleaning activities that can be assigned to staff members.',
  })
  @ApiBody({
    type: CreateCleaningTaskDto,
    description: 'Cleaning task data including name, description, and priority',
  })
  @ApiResponse({
    status: 201,
    description: 'Cleaning task created successfully',
    type: CleaningTaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @Post()
  create(@Body() data: CreateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.create(data);
  }

  @ApiOperation({
    summary: 'Update a cleaning task',
    description:
      'Update an existing cleaning task with new information. Can be used to modify the task description, priority, or other attributes.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning task to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateCleaningTaskDto,
    description: 'Updated cleaning task data',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task updated successfully',
    type: CleaningTaskDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning task not found with the specified ID',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningTaskDto,
  ): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a cleaning task',
    description:
      'Delete a cleaning task by its unique identifier. This removes the task definition from the system permanently.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning task to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task deleted successfully',
    type: CleaningTaskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning task not found with the specified ID',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.remove(id);
  }
}

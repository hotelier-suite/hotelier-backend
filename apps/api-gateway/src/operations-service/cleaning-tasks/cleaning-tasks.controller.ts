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

  @ApiOperation({ summary: 'Get all cleaning tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning tasks',
    type: [CleaningTaskDto],
  })
  @Get()
  findAll(): Observable<CleaningTaskDto[]> {
    return this.cleaningTasksService.findAll();
  }

  @ApiOperation({ summary: 'Get cleaning task by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning task',
    type: CleaningTaskDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new cleaning task' })
  @ApiBody({ type: CreateCleaningTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Cleaning task created successfully',
    type: CleaningTaskDto,
  })
  @Post()
  create(@Body() data: CreateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.create(data);
  }

  @ApiOperation({ summary: 'Update a cleaning task' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task to update',
  })
  @ApiBody({ type: UpdateCleaningTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task updated successfully',
    type: CleaningTaskDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningTaskDto,
  ): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a cleaning task' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning task to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning task deleted successfully',
    type: CleaningTaskDto,
  })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Observable<CleaningTaskDto> {
    return this.cleaningTasksService.delete(id);
  }
}

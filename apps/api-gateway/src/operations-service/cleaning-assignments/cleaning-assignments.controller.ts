import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
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
import { CleaningAssignmentsService } from './cleaning-assignments.service';
import {
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
} from '@app/contracts/operations-service';

@ApiTags('Cleaning Assignments')
@Controller('housekeeping/assignments')
@ApiBearerAuth()
export class CleaningAssignmentsController {
  constructor(
    private readonly cleaningAssignmentsService: CleaningAssignmentsService,
  ) {}

  @ApiOperation({
    summary: 'Get all cleaning assignments',
    description:
      'Retrieve all cleaning assignments in the housekeeping system. Returns a list of assignments with their associated room, staff member, and status information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments',
    type: [CleaningAssignmentDto],
  })
  @Get()
  findAll(): Observable<CleaningAssignmentDto[]> {
    return this.cleaningAssignmentsService.findAll();
  }

  @ApiOperation({
    summary: 'Get cleaning assignment by ID',
    description:
      'Retrieve a specific cleaning assignment by its unique identifier. Returns detailed information about the assignment including room, assigned staff, and completion status.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning assignment',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning assignment',
    type: CleaningAssignmentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found with the specified ID',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Create a new cleaning assignment',
    description:
      'Create a new cleaning assignment by assigning a room to a housekeeping staff member. The assignment includes the room to be cleaned, the assigned employee, and scheduling details.',
  })
  @ApiBody({
    type: CreateCleaningAssignmentDto,
    description: 'Cleaning assignment data including room, staff, and schedule',
  })
  @ApiResponse({
    status: 201,
    description: 'Cleaning assignment created successfully',
    type: CleaningAssignmentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @Post()
  create(
    @Body() data: CreateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.create(data);
  }

  @ApiOperation({
    summary: 'Update a cleaning assignment',
    description:
      'Update an existing cleaning assignment with new information. Can be used to reassign to a different staff member, change the schedule, or update the status.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning assignment to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateCleaningAssignmentDto,
    description: 'Updated cleaning assignment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment updated successfully',
    type: CleaningAssignmentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found with the specified ID',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a cleaning assignment',
    description:
      'Delete a cleaning assignment by its unique identifier. This removes the assignment from the system permanently.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Unique identifier of the cleaning assignment to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment deleted successfully',
    type: CleaningAssignmentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cleaning assignment not found with the specified ID',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.remove(id);
  }
}

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

  @ApiOperation({ summary: 'Get all cleaning assignments' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning assignments',
    type: [CleaningAssignmentDto],
  })
  @Get()
  findAll(): Observable<CleaningAssignmentDto[]> {
    return this.cleaningAssignmentsService.findAll();
  }

  @ApiOperation({ summary: 'Get cleaning assignment by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cleaning assignment',
    type: CleaningAssignmentDto,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new cleaning assignment' })
  @ApiBody({ type: CreateCleaningAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'Cleaning assignment created successfully',
    type: CleaningAssignmentDto,
  })
  @Post()
  create(
    @Body() data: CreateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.create(data);
  }

  @ApiOperation({ summary: 'Update a cleaning assignment' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to update',
  })
  @ApiBody({ type: UpdateCleaningAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment updated successfully',
    type: CleaningAssignmentDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a cleaning assignment' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the cleaning assignment to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleaning assignment deleted successfully',
    type: CleaningAssignmentDto,
  })
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CleaningAssignmentDto> {
    return this.cleaningAssignmentsService.delete(id);
  }
}

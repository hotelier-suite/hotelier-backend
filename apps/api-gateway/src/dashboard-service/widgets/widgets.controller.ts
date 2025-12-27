import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
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
import { WidgetsService } from './widgets.service';
import {
  DashboardWidgetDto,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
} from '@app/contracts/dashboard-service';

@ApiTags('dashboard')
@Controller('dashboard/widgets')
@ApiBearerAuth()
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Widget',
    description: 'Create a new dashboard widget.',
  })
  @ApiBody({
    description: 'Widget creation data',
    type: CreateDashboardWidgetDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Widget created successfully',
    type: DashboardWidgetDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(
    @Body() data: CreateDashboardWidgetDto,
  ): Observable<DashboardWidgetDto> {
    return this.widgetsService.create(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Widgets',
    description: 'Retrieve all dashboard widgets.',
  })
  @ApiResponse({
    status: 200,
    description: 'Widgets retrieved successfully',
    type: [DashboardWidgetDto],
  })
  findAll(): Observable<DashboardWidgetDto[]> {
    return this.widgetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Widget by ID',
    description: 'Retrieve a specific dashboard widget by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Widget ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Widget retrieved successfully',
    type: DashboardWidgetDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<DashboardWidgetDto> {
    return this.widgetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Widget',
    description: 'Update an existing dashboard widget.',
  })
  @ApiParam({
    name: 'id',
    description: 'Widget ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Widget update data',
    type: UpdateDashboardWidgetDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Widget updated successfully',
    type: DashboardWidgetDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDashboardWidgetDto,
  ): Observable<DashboardWidgetDto> {
    return this.widgetsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Widget',
    description: 'Delete a dashboard widget by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Widget ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Widget deleted successfully',
    type: DashboardWidgetDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<DashboardWidgetDto> {
    return this.widgetsService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get Widgets by User',
    description: 'Retrieve all dashboard widgets for a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User widgets retrieved successfully',
    type: [DashboardWidgetDto],
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Observable<DashboardWidgetDto[]> {
    return this.widgetsService.findByUser(userId);
  }
}

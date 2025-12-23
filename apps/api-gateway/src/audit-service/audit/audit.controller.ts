import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuditService } from './audit.service';
import {
  AuditLogDto,
  CreateAuditLogDto,
  AuditLogQueryDto,
  AuditStatisticsDto,
} from '@app/contracts/audit-service/dto';
import { AuditResource, AuditAction } from '@app/contracts/audit-service/enums';

@ApiTags('audit')
@Controller('audit')
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Audit Log',
    description: 'Create a new audit log entry manually',
  })
  @ApiBody({ type: CreateAuditLogDto })
  @ApiResponse({
    status: 201,
    description: 'Audit log created successfully',
    type: AuditLogDto,
  })
  create(
    @Body() createAuditLogDto: CreateAuditLogDto,
  ): Observable<AuditLogDto> {
    return this.auditService.create(createAuditLogDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Audit Logs',
    description: 'Retrieve audit logs with filtering and pagination',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
    type: Number,
  })
  @ApiQuery({
    name: 'action',
    required: false,
    description: 'Filter by action',
    enum: AuditAction,
  })
  @ApiQuery({
    name: 'resource',
    required: false,
    description: 'Filter by resource',
    enum: AuditResource,
  })
  @ApiQuery({
    name: 'resourceId',
    required: false,
    description: 'Filter by resource ID',
    type: String,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date (ISO string)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date (ISO string)',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in description',
    type: String,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take',
    type: Number,
    example: 50,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AuditLogDto' },
        },
        total: {
          type: 'number',
          description: 'Total number of audit logs',
        },
      },
    },
  })
  findAll(
    @Query() query: AuditLogQueryDto,
  ): Observable<{ data: AuditLogDto[]; total: number }> {
    return this.auditService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get Audit Statistics',
    description: 'Get audit log statistics for the specified period',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to include in statistics',
    type: Number,
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Audit statistics retrieved successfully',
    type: AuditStatisticsDto,
  })
  getStatistics(
    @Query('days', ParseIntPipe) days: number = 30,
  ): Observable<AuditStatisticsDto> {
    return this.auditService.getStatistics(days);
  }

  @Get('resource/:resource/:resourceId')
  @ApiOperation({
    summary: 'Get Resource Audit History',
    description: 'Get all audit logs for a specific resource',
  })
  @ApiParam({
    name: 'resource',
    description: 'Resource type',
    enum: AuditResource,
  })
  @ApiParam({
    name: 'resourceId',
    description: 'Resource ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resource audit history retrieved successfully',
    type: [AuditLogDto],
  })
  findByResource(
    @Param('resource') resource: string,
    @Param('resourceId') resourceId: string,
  ): Observable<AuditLogDto[]> {
    return this.auditService.findByResource(
      resource as AuditResource,
      resourceId,
    );
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get User Audit History',
    description: 'Get audit logs for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of logs to return',
    type: Number,
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'User audit history retrieved successfully',
    type: [AuditLogDto],
  })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', ParseIntPipe) limit: number = 100,
  ): Observable<AuditLogDto[]> {
    return this.auditService.findByUser(userId, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Audit Log Details',
    description: 'Get detailed information about a specific audit log',
  })
  @ApiParam({
    name: 'id',
    description: 'Audit log ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Audit log details retrieved successfully',
    type: AuditLogDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<AuditLogDto> {
    return this.auditService.findOne(id);
  }
}

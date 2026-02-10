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
  PaginatedAuditLogDto,
} from '@app/contracts/audit-service';

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
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
    type: PaginatedAuditLogDto,
  })
  findAll(@Query() query: AuditLogQueryDto): Observable<PaginatedAuditLogDto> {
    return this.auditService.findAllWithUsers(query);
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

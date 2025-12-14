import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Sse,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@AuditLog({ resource: AuditResource.NOTIFICATION })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'List notifications',
    description:
      'List unread notifications. Use includeRead=true to include read notifications.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: [Notification],
  })
  async list(
    @Query('userId') userId?: number,
    @Query('includeRead') includeRead?: string,
  ): Promise<Notification[]> {
    const include = String(includeRead).toLowerCase() === 'true';
    return this.notificationsService.listForUser(
      userId ? Number(userId) : undefined,
      include,
    );
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification read' })
  @ApiResponse({ status: 204, description: 'Notification marked as read' })
  async markRead(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notificationsService.markRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications read' })
  @ApiResponse({ status: 204, description: 'All notifications marked as read' })
  async markAllRead(@Query('userId') userId?: number): Promise<void> {
    await this.notificationsService.markAllRead(
      userId ? Number(userId) : undefined,
    );
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Notifications stream (SSE)' })
  @ApiResponse({ status: 200, description: 'Server-Sent Events stream' })
  stream(): Observable<any> {
    return this.notificationsService
      .stream()
      .pipe(map((n: Notification) => ({ data: n })));
  }
}

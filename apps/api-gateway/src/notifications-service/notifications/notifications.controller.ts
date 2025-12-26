import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  ParseBoolPipe,
  Query,
  Sse,
  MessageEvent,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from '@app/contracts/notifications-service';
import { CurrentUserId } from '../../common';
import { Observable } from 'rxjs';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
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
    type: [NotificationDto],
  })
  list(
    @CurrentUserId() userId: number,
    @Query('includeRead', new DefaultValuePipe(false), ParseBoolPipe)
    includeRead: boolean,
  ): Observable<NotificationDto[]> {
    return this.notificationsService.listForUser(userId, includeRead);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification read' })
  @ApiResponse({ status: 204, description: 'Notification marked as read' })
  markRead(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Observable<void> {
    return this.notificationsService.markRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications read' })
  @ApiResponse({ status: 204, description: 'All notifications marked as read' })
  markAllRead(@CurrentUserId() userId: number): Observable<void> {
    return this.notificationsService.markAllRead(userId);
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Notifications stream (SSE)' })
  @ApiResponse({ status: 200, description: 'Server-Sent Events stream' })
  stream(@CurrentUserId() userId: number): Observable<MessageEvent> {
    return this.notificationsService.streamForUser(userId);
  }
}

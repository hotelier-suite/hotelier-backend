import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  NotificationDto,
  ListNotificationsPayloadDto,
  MarkNotificationReadPayloadDto,
  MarkAllNotificationsReadPayloadDto,
  NOTIFICATIONS_PATTERNS,
} from '@app/contracts/notifications-service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern(NOTIFICATIONS_PATTERNS.LIST_FOR_USER)
  findForUser(
    @Payload() payload: ListNotificationsPayloadDto,
  ): Promise<NotificationDto[]> {
    return this.notificationsService.findForUser(
      payload?.userId,
      payload?.includeRead ?? false,
    );
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.CREATE)
  create(@Payload() data: CreateNotificationDto): Promise<NotificationDto> {
    return this.notificationsService.create(data);
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.MARK_READ)
  markRead(@Payload() payload: MarkNotificationReadPayloadDto): Promise<void> {
    return this.notificationsService.markRead(payload.id, payload.userId);
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.MARK_ALL_READ)
  markAllRead(
    @Payload() payload: MarkAllNotificationsReadPayloadDto,
  ): Promise<void> {
    return this.notificationsService.markAllRead(payload?.userId);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications-service/notifications/notifications.patterns';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from '@app/contracts/notifications-service/notifications/dto/create-notification.dto';
import { NotificationDto } from '@app/contracts/notifications-service/notifications/dto/notification.dto';
import { ListNotificationsPayloadDto } from '@app/contracts/notifications-service/notifications/dto/list-notifications-payload.dto';
import { MarkNotificationReadPayloadDto } from '@app/contracts/notifications-service/notifications/dto/mark-notification-read-payload.dto';
import { MarkAllNotificationsReadPayloadDto } from '@app/contracts/notifications-service/notifications/dto/mark-all-notifications-read-payload.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern(NOTIFICATIONS_PATTERNS.LIST_FOR_USER)
  listForUser(
    @Payload() payload: ListNotificationsPayloadDto,
  ): Promise<NotificationDto[]> {
    return this.notificationsService.listForUser(
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

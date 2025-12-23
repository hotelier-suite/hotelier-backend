import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { NOTIFICATIONS_SERVICE_CLIENT } from './constants';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications-service/notifications/notifications.patterns';
import { CreateNotificationDto } from '@app/contracts/notifications-service/notifications/dto/create-notification.dto';
import { NotificationDto } from '@app/contracts/notifications-service/notifications/dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE_CLIENT)
    private readonly notificationsClient: ClientProxy,
  ) {}

  create(data: CreateNotificationDto): Observable<NotificationDto> {
    return this.notificationsClient.send<NotificationDto, CreateNotificationDto>(
      NOTIFICATIONS_PATTERNS.CREATE,
      data,
    );
  }
}

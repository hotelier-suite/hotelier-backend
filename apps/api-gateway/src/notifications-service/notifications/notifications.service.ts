import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { filter, Observable, Subject, tap } from 'rxjs';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications-service/notifications/notifications.patterns';
import { CreateNotificationDto } from '@app/contracts/notifications-service/notifications/dto/create-notification.dto';
import { ListNotificationsPayloadDto } from '@app/contracts/notifications-service/notifications/dto/list-notifications-payload.dto';
import { MarkAllNotificationsReadPayloadDto } from '@app/contracts/notifications-service/notifications/dto/mark-all-notifications-read-payload.dto';
import { MarkNotificationReadPayloadDto } from '@app/contracts/notifications-service/notifications/dto/mark-notification-read-payload.dto';
import { NotificationDto } from '@app/contracts/notifications-service/notifications/dto/notification.dto';
import { NotificationType } from '@app/contracts/notifications-service/notifications/enums/notification-type.enum';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE_CLIENT)
    private readonly notificationsClient: ClientProxy,
  ) {}

  // In-memory subject for simple real-time streaming via SSE
  private notifications$ = new Subject<MessageEvent>();

  create(params: CreateNotificationDto): Observable<NotificationDto> {
    return this.notificationsClient
      .send<
        NotificationDto,
        CreateNotificationDto
      >(NOTIFICATIONS_PATTERNS.CREATE, params)
      .pipe(
        tap((saved) => {
          // Emit to SSE subscribers (best-effort)
          try {
            this.notifications$.next({ data: saved });
          } catch {
            // ignore emission errors
          }
        }),
      );
  }

  listForUser(
    userId?: number,
    includeRead = false,
  ): Observable<NotificationDto[]> {
    const payload: ListNotificationsPayloadDto = {
      userId: userId ?? null,
      includeRead,
    };

    return this.notificationsClient.send<
      NotificationDto[],
      ListNotificationsPayloadDto
    >(NOTIFICATIONS_PATTERNS.LIST_FOR_USER, payload);
  }

  markRead(id: number, userId?: number): Observable<void> {
    const payload: MarkNotificationReadPayloadDto = { id, userId };
    return this.notificationsClient.send<void, MarkNotificationReadPayloadDto>(
      NOTIFICATIONS_PATTERNS.MARK_READ,
      payload,
    );
  }

  markAllRead(userId?: number): Observable<void> {
    const payload: MarkAllNotificationsReadPayloadDto = { userId };
    return this.notificationsClient.send<
      void,
      MarkAllNotificationsReadPayloadDto
    >(NOTIFICATIONS_PATTERNS.MARK_ALL_READ, payload);
  }

  // Expose real-time stream for SSE consumers
  stream(): Observable<MessageEvent> {
    return this.notifications$.asObservable();
  }

  streamForUser(userId: number): Observable<MessageEvent> {
    return this.notifications$.asObservable().pipe(
      filter((event) => {
        const data = event.data;
        if (typeof data !== 'object' || data == null) {
          return false;
        }

        const notification = data as NotificationDto;
        return notification.userId == null || notification.userId === userId;
      }),
    );
  }

  // Convenience helpers for system-level alerts
  createSystemAlert(
    title: string,
    message: string,
    refId?: number,
    refType?: string,
  ): Observable<NotificationDto> {
    return this.create({
      type: NotificationType.ALERT,
      title,
      message,
      refId,
      refType,
      userId: null,
    });
  }
}

import { Inject, Injectable, MessageEvent } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { filter, Observable, Subject, tap } from 'rxjs';
import {
  NOTIFICATIONS_PATTERNS,
  CreateNotificationDto,
  ListNotificationsPayloadDto,
  MarkAllNotificationsReadPayloadDto,
  MarkNotificationReadPayloadDto,
  NotificationDto,
  NotificationType,
} from '@app/contracts/notifications-service';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE_CLIENT)
    private readonly notificationsClient: ClientProxy,
  ) {}

  private notifications$ = new Subject<MessageEvent>();

  create(params: CreateNotificationDto): Observable<NotificationDto> {
    return this.notificationsClient
      .send<
        NotificationDto,
        CreateNotificationDto
      >(NOTIFICATIONS_PATTERNS.CREATE, params)
      .pipe(tap((saved) => this.notifications$.next({ data: saved })));
  }

  findForUser(
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

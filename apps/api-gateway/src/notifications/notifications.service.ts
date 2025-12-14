import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { Subject } from 'rxjs';

interface CreateNotificationParams {
  type?: NotificationType;
  title: string;
  message: string;
  refId?: number;
  refType?: string;
  userId?: number | null;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  // In-memory subject for simple real-time streaming via SSE
  private notifications$ = new Subject<Notification>();

  async create(params: CreateNotificationParams): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      type: params.type ?? NotificationType.INFO,
      title: params.title,
      message: params.message,
      refId: params.refId,
      refType: params.refType,
      userId: params.userId ?? null,
    });
    const saved = await this.notificationsRepository.save(notification);
    // Emit to SSE subscribers (best-effort)
    try {
      this.notifications$.next(saved);
    } catch {
      // ignore emission errors
    }
    return saved;
  }

  async listForUser(
    userId?: number,
    includeRead = false,
  ): Promise<Notification[]> {
    const qb = this.notificationsRepository
      .createQueryBuilder('n')
      .where('(n.userId IS NULL OR n.userId = :uid)', { uid: userId ?? null })
      .orderBy('n.createdAt', 'DESC');

    if (!includeRead) {
      qb.andWhere('n.isRead = false');
    }

    return qb.getMany();
  }

  async markRead(id: number, userId?: number): Promise<void> {
    if (userId != null) {
      await this.notificationsRepository.update(
        { id, userId },
        { isRead: true },
      );
      return;
    }
    await this.notificationsRepository.update({ id }, { isRead: true });
  }

  async markAllRead(userId?: number): Promise<void> {
    await this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('userId = :uid OR userId IS NULL', { uid: userId ?? null })
      .execute();
  }

  // Expose real-time stream for SSE consumers
  stream() {
    return this.notifications$.asObservable();
  }

  // Convenience helpers for system-level alerts
  async createSystemAlert(
    title: string,
    message: string,
    refId?: number,
    refType?: string,
  ) {
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

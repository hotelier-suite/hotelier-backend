import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities';
import {
  NotificationType,
  CreateNotificationDto,
  NotificationDto,
} from '@app/contracts/notifications-service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  create(data: CreateNotificationDto): Promise<NotificationDto> {
    return this.notificationsRepository.save(data);
  }

  async findForUser(
    userId?: number | null,
    includeRead = false,
  ): Promise<NotificationDto[]> {
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
    const qb = this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('id = :id', { id });

    if (userId != null) {
      qb.andWhere('(userId = :uid OR userId IS NULL)', { uid: userId });
    } else {
      qb.andWhere('userId IS NULL');
    }

    await qb.execute();
  }

  async markAllRead(userId?: number): Promise<void> {
    const qb = this.notificationsRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true });

    if (userId != null) {
      qb.where('userId = :uid OR userId IS NULL', { uid: userId });
    } else {
      qb.where('userId IS NULL');
    }

    await qb.execute();
  }
}

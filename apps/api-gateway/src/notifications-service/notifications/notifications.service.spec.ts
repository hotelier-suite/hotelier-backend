import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { NotificationsService } from './';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';

describe('NotificationsService (gateway)', () => {
  let service: NotificationsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NOTIFICATIONS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should create and push to subject', async () => {
    const notification = { id: 1, title: 'Test' };
    mockClient.send.mockReturnValueOnce(of(notification));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findForUser', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findForUser(1, false));
    expect(result).toEqual([]);
  });

  it('should findForUser without userId', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findForUser());
    expect(result).toEqual([]);
  });

  it('should markRead', async () => {
    mockClient.send.mockReturnValueOnce(of(undefined));
    await lastValueFrom(service.markRead(1, 1));
    expect(mockClient.send).toHaveBeenCalled();
  });

  it('should markAllRead', async () => {
    mockClient.send.mockReturnValueOnce(of(undefined));
    await lastValueFrom(service.markAllRead(1));
    expect(mockClient.send).toHaveBeenCalled();
  });

  it('should stream returns observable', (done) => {
    const notification = { id: 1, title: 'Test', userId: 1 };
    mockClient.send.mockReturnValueOnce(of(notification));
    
    // Subscribe to stream first
    const streamSub = service.stream().subscribe((event: MessageEvent) => {
      expect(event.data).toEqual(notification);
      streamSub.unsubscribe();
      done();
    });

    // Create notification which should trigger the stream
    service.create({} as never).subscribe();
  });

  it('should streamForUser filters by userId', (done) => {
    const notification = { id: 1, title: 'Test', userId: 123 };
    mockClient.send.mockReturnValueOnce(of(notification));
    
    // Subscribe to stream for specific user
    const streamSub = service.streamForUser(123).subscribe((event: MessageEvent) => {
      expect(event.data).toEqual(notification);
      expect((event.data as any).userId).toBe(123);
      streamSub.unsubscribe();
      done();
    });

    // Create notification which should trigger the stream
    service.create({} as never).subscribe();
  });

  it('should streamForUser filter out notifications for other users', (done) => {
    const notification1 = { id: 1, title: 'Test', userId: 999 };
    const notification2 = { id: 2, title: 'Test2', userId: 123 };
    
    let receivedCount = 0;
    const streamSub = service.streamForUser(123).subscribe((event: MessageEvent) => {
      receivedCount++;
      expect((event.data as any).userId).toBe(123);
      if (receivedCount === 1) {
        streamSub.unsubscribe();
        done();
      }
    });

    // Create notification for different user (should be filtered out)
    mockClient.send.mockReturnValueOnce(of(notification1));
    service.create({} as never).subscribe();

    // Create notification for target user (should pass through)
    setTimeout(() => {
      mockClient.send.mockReturnValueOnce(of(notification2));
      service.create({} as never).subscribe();
    }, 10);
  });

  it('should streamForUser allow notifications with null userId', (done) => {
    const notification = { id: 1, title: 'System', userId: null };
    mockClient.send.mockReturnValueOnce(of(notification));
    
    const streamSub = service.streamForUser(123).subscribe((event: MessageEvent) => {
      expect((event.data as any).userId).toBeNull();
      streamSub.unsubscribe();
      done();
    });

    service.create({} as never).subscribe();
  });

  it('should streamForUser filter out invalid event data', (done) => {
    const invalidNotification = 'not an object';
    const validNotification = { id: 2, title: 'Valid', userId: 123 };
    
    let receivedCount = 0;
    const streamSub = service.streamForUser(123).subscribe((event: MessageEvent) => {
      receivedCount++;
      expect(typeof event.data).toBe('object');
      if (receivedCount === 1) {
        streamSub.unsubscribe();
        done();
      }
    });

    // Create invalid notification (should be filtered out)
    mockClient.send.mockReturnValueOnce(of(invalidNotification));
    service.create({} as never).subscribe();

    // Create valid notification
    setTimeout(() => {
      mockClient.send.mockReturnValueOnce(of(validNotification));
      service.create({} as never).subscribe();
    }, 10);
  });

  it('should createSystemAlert', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1, title: 'Alert' }));
    const result = await lastValueFrom(
      service.createSystemAlert('Alert', 'Message'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should createSystemAlert with optional params', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 2 }));
    const result = await lastValueFrom(
      service.createSystemAlert('Alert', 'Msg', 1, 'BOOKING'),
    );
    expect(result).toHaveProperty('id');
  });
});

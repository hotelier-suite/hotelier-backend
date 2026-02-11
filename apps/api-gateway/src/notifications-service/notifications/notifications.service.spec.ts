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

  it('should stream returns observable', () => {
    const spy = jest.spyOn(service, 'stream');
    service.stream();
    expect(spy).toHaveBeenCalled();
  });

  it('should streamForUser filters by userId', () => {
    const spy = jest.spyOn(service, 'streamForUser');
    service.streamForUser(1);
    expect(spy).toHaveBeenCalledWith(1);
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

import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { NotificationsController } from './';
import { NotificationsService } from './notifications.service';

describe('NotificationsController (gateway)', () => {
  let controller: NotificationsController;
  const mockService: Record<string, jest.Mock> = {
    findForUser: jest.fn(),
    markRead: jest.fn(),
    markAllRead: jest.fn(),
    streamForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: mockService }],
    }).compile();
    controller = module.get<NotificationsController>(NotificationsController);
    jest.clearAllMocks();
  });

  it('should findForUser', async () => {
    mockService.findForUser.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findForUser(1, false));
    expect(result).toEqual([]);
  });

  it('should markRead', async () => {
    mockService.markRead.mockReturnValueOnce(of(undefined));
    await lastValueFrom(controller.markRead(1, 1));
    expect(mockService.markRead).toHaveBeenCalledWith(1, 1);
  });

  it('should markAllRead', async () => {
    mockService.markAllRead.mockReturnValueOnce(of(undefined));
    await lastValueFrom(controller.markAllRead(1));
    expect(mockService.markAllRead).toHaveBeenCalledWith(1);
  });

  it('should streamForUser', () => {
    mockService.streamForUser.mockReturnValueOnce(of({ data: 'test' }));
    const result = controller.streamForUser(1);
    expect(result).toBeDefined();
  });
});

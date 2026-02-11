import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { NotificationsService } from './';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';
import { NOTIFICATIONS_PATTERNS } from '@app/contracts/notifications-service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const mockClient: Record<string, jest.Mock> = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NOTIFICATIONS_SERVICE_CLIENT,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a notification via client proxy', () => {
    const notification = {
      id: 1,
      title: 'Shift Created',
      message: 'New shift assigned',
    };
    mockClient.send.mockReturnValueOnce(of(notification));
    const result = service.create({
      title: 'Shift Created',
      message: 'New shift assigned',
      type: 'STAFF' as never,
    });

    result.subscribe((value) => {
      expect(value).toEqual(notification);
    });

    expect(mockClient.send).toHaveBeenCalledWith(
      NOTIFICATIONS_PATTERNS.CREATE,
      {
        title: 'Shift Created',
        message: 'New shift assigned',
        type: 'STAFF',
      },
    );
  });
});

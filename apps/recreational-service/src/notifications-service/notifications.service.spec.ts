import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { NotificationsService } from './';
import { NOTIFICATIONS_SERVICE_CLIENT } from './constants';
import { NotificationType } from '@app/contracts/notifications-service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockClient = {
    send: jest.fn(),
  };

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should send notification via client', () => {
      const dto = {
        type: NotificationType.INFO,
        title: 'Test',
        message: 'Test message',
        refId: 1,
        refType: 'test',
      };
      const mockResponse = {
        id: 1,
        ...dto,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const spy = jest
        .spyOn(mockClient, 'send')
        .mockReturnValueOnce(of(mockResponse));
      const result = service.create(dto);
      expect(spy).toHaveBeenCalledWith(
        'notifications.notifications.create',
        dto,
      );
      result.subscribe((value) => {
        expect(value).toEqual(mockResponse);
      });
    });
  });
});

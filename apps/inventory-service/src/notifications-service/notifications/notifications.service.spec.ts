import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';
import { NotificationType } from '@app/contracts/notifications-service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let client: Record<string, jest.Mock>;

  beforeEach(async () => {
    client = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NOTIFICATIONS_SERVICE_CLIENT,
          useValue: client,
        },
      ],
    }).compile();

    service = module.get(NotificationsService);
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
        refType: 'inventory',
        userId: null,
      };
      const expected = { id: 1, ...dto };
      client.send.mockReturnValueOnce(of(expected));

      const result = service.create(dto);

      result.subscribe((value) => {
        expect(value).toEqual(expected);
      });
      expect(client.send).toHaveBeenCalledWith(
        'notifications.notifications.create',
        dto,
      );
    });
  });
});

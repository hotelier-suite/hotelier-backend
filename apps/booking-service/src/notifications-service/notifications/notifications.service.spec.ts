import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { NotificationsService } from './';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../constants';

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
    it('should send notification via client proxy', () => {
      const dto = {
        title: 'Test',
        message: 'Test notification',
        type: 'INFO' as never,
        refId: 1,
        refType: 'reservation',
        userId: null,
      };

      const mockNotification = { id: 1, ...dto };
      mockClient.send.mockReturnValueOnce(of(mockNotification));

      const result = service.create(dto);

      result.subscribe((value) => {
        expect(value).toEqual(mockNotification);
      });

      expect(mockClient.send).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './notifications/entities';
import { NotificationsService } from './notifications';
import { NotificationsController } from './notifications';
import { SeedersService } from './seeders';

describe('NotificationsServiceModule', () => {
  it('should compile the module with mocked dependencies', async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        SeedersService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(NotificationsService)).toBeDefined();
    expect(module.get(NotificationsController)).toBeDefined();
    expect(module.get(SeedersService)).toBeDefined();
  });
});

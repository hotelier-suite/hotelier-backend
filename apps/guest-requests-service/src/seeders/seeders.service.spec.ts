import { Test } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import { GuestRequestsSeeder } from '../guest-requests';

describe('SeedersService', () => {
  let service: SeedersService;
  let guestRequestsSeeder: GuestRequestsSeeder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: GuestRequestsSeeder,
          useValue: {
            seed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SeedersService);
    guestRequestsSeeder = module.get(GuestRequestsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call guestRequestsSeeder.seed', async () => {
      const spy = jest
        .spyOn(guestRequestsSeeder, 'seed')
        .mockResolvedValue(undefined);

      await service.seed();

      expect(spy).toHaveBeenCalled();
    });
  });
});

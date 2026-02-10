import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import { InvoicesSeeder, PaymentsSeeder } from './domains';

describe('SeedersService', () => {
  let service: SeedersService;
  let invoicesSeeder: InvoicesSeeder;
  let paymentsSeeder: PaymentsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: InvoicesSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: PaymentsSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get(SeedersService);
    invoicesSeeder = module.get(InvoicesSeeder);
    paymentsSeeder = module.get(PaymentsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders', async () => {
    const invSpy = jest.spyOn(invoicesSeeder, 'seed');
    const paySpy = jest.spyOn(paymentsSeeder, 'seed');

    await service.seed();
    expect(invSpy).toHaveBeenCalled();
    expect(paySpy).toHaveBeenCalled();
  });
});

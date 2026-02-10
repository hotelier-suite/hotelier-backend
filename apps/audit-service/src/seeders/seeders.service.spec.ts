import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './seeders.service';
import { AuditLogsSeeder } from './domains';

describe('SeedersService', () => {
  let service: SeedersService;
  let auditLogsSeeder: AuditLogsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: AuditLogsSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get(SeedersService);
    auditLogsSeeder = module.get(AuditLogsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call auditLogsSeeder.seed', async () => {
    const spy = jest.spyOn(auditLogsSeeder, 'seed');

    await service.seed();
    expect(spy).toHaveBeenCalled();
  });
});

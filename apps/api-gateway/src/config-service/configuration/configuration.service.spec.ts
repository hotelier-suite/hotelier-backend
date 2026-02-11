import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ConfigurationService } from './';
import { CONFIG_SERVICE_CLIENT } from '../constants';

describe('ConfigurationService (gateway)', () => {
  let service: ConfigurationService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        { provide: CONFIG_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<ConfigurationService>(ConfigurationService);
    jest.clearAllMocks();
  });

  it('should getHotelConfig', async () => {
    mockClient.send.mockReturnValueOnce(of({ hotelName: 'Test Hotel' }));
    const result = await lastValueFrom(service.getHotelConfig());
    expect(result).toHaveProperty('hotelName');
  });

  it('should updateHotelConfig', async () => {
    mockClient.send.mockReturnValueOnce(of({ hotelName: 'Updated' }));
    const result = await lastValueFrom(service.updateHotelConfig({} as never));
    expect(result).toHaveProperty('hotelName');
  });
});

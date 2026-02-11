import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ConfigurationController } from './';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationController (gateway)', () => {
  let controller: ConfigurationController;
  const mockService: Record<string, jest.Mock> = {
    getHotelConfig: jest.fn(),
    updateHotelConfig: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [{ provide: ConfigurationService, useValue: mockService }],
    }).compile();
    controller = module.get<ConfigurationController>(ConfigurationController);
    jest.clearAllMocks();
  });

  it('should getHotelConfig', async () => {
    mockService.getHotelConfig.mockReturnValueOnce(of({ hotelName: 'Test' }));
    const result = await lastValueFrom(controller.getHotelConfig());
    expect(result).toHaveProperty('hotelName');
  });

  it('should updateHotelConfig', async () => {
    mockService.updateHotelConfig.mockReturnValueOnce(of({ hotelName: 'X' }));
    const result = await lastValueFrom(
      controller.updateHotelConfig({} as never),
    );
    expect(result).toHaveProperty('hotelName');
  });
});

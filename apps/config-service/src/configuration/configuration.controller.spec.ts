import { Test } from '@nestjs/testing';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationController', () => {
  let controller: ConfigurationController;
  let service: ConfigurationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [
        {
          provide: ConfigurationService,
          useValue: {
            getHotelConfig: jest.fn(),
            updateHotelConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ConfigurationController);
    service = module.get(ConfigurationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── getHotelConfig ───────────────────────────────────────────────

  describe('getHotelConfig', () => {
    it('should return hotel configuration', async () => {
      const config = {
        id: 1,
        propertyName: 'Grand Hotel Plaza',
        propertyAddress: '123 Main St',
        propertyPhone: '+1-555-123-4567',
        propertyEmail: 'info@hotel.com',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: '24 hours before arrival',
        timeZone: 'UTC',
      };
      const spy = jest
        .spyOn(service, 'getHotelConfig')
        .mockResolvedValue(config);

      const result = await controller.getHotelConfig();

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(config);
    });
  });

  // ─── updateHotelConfig ────────────────────────────────────────────

  describe('updateHotelConfig', () => {
    it('should update hotel configuration with all fields', async () => {
      const dto = {
        name: 'Updated Hotel',
        address: '456 New St',
        phone: '+1-555-999-0000',
        email: 'new@hotel.com',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        timezone: 'America/New_York',
      };
      const updated = {
        id: 1,
        propertyName: 'Updated Hotel',
        propertyAddress: '456 New St',
        propertyPhone: '+1-555-999-0000',
        propertyEmail: 'new@hotel.com',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: '24 hours before arrival',
        timeZone: 'America/New_York',
      };
      const spy = jest
        .spyOn(service, 'updateHotelConfig')
        .mockResolvedValue(updated);

      const result = await controller.updateHotelConfig(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(updated);
    });

    it('should update hotel configuration with partial fields', async () => {
      const dto = { name: 'Only Name Updated' };
      const updated = {
        id: 1,
        propertyName: 'Only Name Updated',
        propertyAddress: '123 Main St',
        propertyPhone: '+1-555-123-4567',
        propertyEmail: 'info@hotel.com',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: '24 hours before arrival',
        timeZone: 'UTC',
      };
      const spy = jest
        .spyOn(service, 'updateHotelConfig')
        .mockResolvedValue(updated);

      const result = await controller.updateHotelConfig(dto);

      expect(spy).toHaveBeenCalledWith(dto);
      expect(result.propertyName).toBe('Only Name Updated');
    });
  });
});

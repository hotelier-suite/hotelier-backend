import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigurationService } from './configuration.service';
import { Configuration } from './entities';
import { ConfigCategory } from './enums';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getHotelConfig ───────────────────────────────────────────────

  describe('getHotelConfig', () => {
    it('should return hotel config from stored values', async () => {
      // getHotelConfig calls getValue 8 times in order:
      // PROPERTY_NAME, PROPERTY_ADDRESS, PROPERTY_PHONE, PROPERTY_EMAIL,
      // CHECKIN_TIME, CHECKOUT_TIME, CANCELLATION_POLICY, TIMEZONE
      repo.findOne
        .mockResolvedValueOnce({ value: 'Grand Hotel' })
        .mockResolvedValueOnce({ value: '123 Main St' })
        .mockResolvedValueOnce({ value: '+1-555-1234' })
        .mockResolvedValueOnce({ value: 'info@hotel.com' })
        .mockResolvedValueOnce({ value: '14:00' })
        .mockResolvedValueOnce({ value: '10:00' })
        .mockResolvedValueOnce({ value: 'Flexible' })
        .mockResolvedValueOnce({ value: 'America/New_York' });

      const result = await service.getHotelConfig();

      expect(result).toEqual({
        id: 1,
        propertyName: 'Grand Hotel',
        propertyAddress: '123 Main St',
        propertyPhone: '+1-555-1234',
        propertyEmail: 'info@hotel.com',
        checkInTime: '14:00',
        checkOutTime: '10:00',
        cancellationPolicy: 'Flexible',
        timeZone: 'America/New_York',
      });
    });

    it('should return defaults when no config values exist', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.getHotelConfig();

      expect(result).toEqual({
        id: 1,
        propertyName: '',
        propertyAddress: '',
        propertyPhone: '',
        propertyEmail: '',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: '',
        timeZone: 'UTC',
      });
    });

    it('should handle partial config values', async () => {
      // Only PROPERTY_NAME returns a value, rest are null
      repo.findOne
        .mockResolvedValueOnce({ value: 'My Hotel' })
        .mockResolvedValue(null);

      const result = await service.getHotelConfig();

      expect(result.propertyName).toBe('My Hotel');
      expect(result.checkInTime).toBe('15:00');
      expect(result.checkOutTime).toBe('11:00');
      expect(result.timeZone).toBe('UTC');
    });
  });

  // ─── updateHotelConfig ────────────────────────────────────────────

  describe('updateHotelConfig', () => {
    it('should create new config entries when none exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({
        category: ConfigCategory.HOTEL,
        key: 'PROPERTY_NAME',
        value: 'New Hotel',
      });
      repo.save.mockResolvedValue({});

      await service.updateHotelConfig({ name: 'New Hotel' });

      expect(repo.create).toHaveBeenCalledWith({
        category: ConfigCategory.HOTEL,
        key: 'PROPERTY_NAME',
        value: 'New Hotel',
        description: 'Hotel setting PROPERTY_NAME',
      });
      expect(repo.save).toHaveBeenCalled();
    });

    it('should update existing config entry when value differs', async () => {
      // setValue calls findOne for PROPERTY_NAME — returns existing with different value
      // Then getHotelConfig calls findOne 8 more times
      repo.findOne
        .mockResolvedValueOnce({
          id: 10,
          value: 'Old Hotel',
          description: 'Hotel setting PROPERTY_NAME',
        })
        .mockResolvedValue(null);

      await service.updateHotelConfig({ name: 'New Hotel' });

      expect(repo.update).toHaveBeenCalledWith(10, {
        value: 'New Hotel',
        description: 'Hotel setting PROPERTY_NAME',
      });
    });

    it('should not update existing config entry when values match', async () => {
      repo.findOne
        .mockResolvedValueOnce({
          id: 10,
          value: 'Same Hotel',
          description: 'Hotel setting PROPERTY_NAME',
        })
        .mockResolvedValue(null);

      await service.updateHotelConfig({ name: 'Same Hotel' });

      expect(repo.update).not.toHaveBeenCalled();
    });

    it('should skip undefined fields in the update', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({});
      repo.save.mockResolvedValue({});

      await service.updateHotelConfig({ name: 'Hotel', checkInTime: '14:00' });

      // create should have been called twice (PROPERTY_NAME + CHECKIN_TIME)
      expect(repo.create).toHaveBeenCalledTimes(2);
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'PROPERTY_NAME' }),
      );
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'CHECKIN_TIME' }),
      );
    });

    it('should update multiple fields at once', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({});
      repo.save.mockResolvedValue({});

      await service.updateHotelConfig({
        name: 'Hotel',
        address: 'Addr',
        phone: '555',
        email: 'a@b.com',
        checkInTime: '13:00',
        checkOutTime: '10:00',
        timezone: 'EST',
      });

      expect(repo.save).toHaveBeenCalledTimes(7);
    });

    it('should return the updated hotel config after saving', async () => {
      // First findOne for setValue (PROPERTY_NAME) — not found, so creates
      // Then 8 findOne calls for getHotelConfig
      repo.findOne
        .mockResolvedValueOnce(null) // setValue check
        .mockResolvedValueOnce({ value: 'Updated' }) // getHotelConfig: PROPERTY_NAME
        .mockResolvedValue(null); // rest of getHotelConfig defaults
      repo.create.mockReturnValue({});
      repo.save.mockResolvedValue({});

      const result = await service.updateHotelConfig({ name: 'Updated' });

      expect(result.propertyName).toBe('Updated');
    });
  });
});

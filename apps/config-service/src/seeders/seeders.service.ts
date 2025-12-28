import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration, ConfigCategory } from '../configuration';

@Injectable()
export class SeedersService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  private async setIfMissing(
    category: ConfigCategory,
    key: string,
    value: string,
    description: string,
    isEditable = true,
    isSecure = false,
  ) {
    const existing = await this.configurationRepository.findOne({
      where: { category, key },
    });

    if (!existing) {
      await this.configurationRepository.save({
        category,
        key,
        value,
        description,
        isEditable,
        isSecure,
      });
    }
  }

  async seed(): Promise<void> {
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'PROPERTY_NAME',
      'Grand Hotel Plaza',
      'Hotel property name',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'PROPERTY_ADDRESS',
      '123 Main Street, City, State 12345',
      'Hotel property address',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'PROPERTY_PHONE',
      '+1-555-123-4567',
      'Hotel property phone',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'PROPERTY_EMAIL',
      'info@grandhotelplaza.com',
      'Hotel property email',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'CHECKIN_TIME',
      '15:00',
      'Standard check-in time',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'CHECKOUT_TIME',
      '11:00',
      'Standard check-out time',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'CANCELLATION_POLICY',
      '24 hours before arrival',
      'Cancellation policy',
    );
    await this.setIfMissing(
      ConfigCategory.HOTEL,
      'TIMEZONE',
      'UTC',
      'Default timezone',
    );

    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'SYSTEM_NAME',
      'Hotelier Management System',
      'System Name',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'VERSION',
      '1.0.0',
      'System Version',
      false,
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'MAINTENANCE_MODE',
      'false',
      'Maintenance mode flag',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'DEBUG_MODE',
      'false',
      'Debug mode flag',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'LOG_LEVEL',
      'INFO',
      'Log level',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'SESSION_TIMEOUT',
      '30',
      'Session timeout (minutes)',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'MAX_FILE_UPLOAD_SIZE',
      '10',
      'Max file upload size (MB)',
    );
    await this.setIfMissing(
      ConfigCategory.SYSTEM,
      'ALLOWED_FILE_TYPES',
      'jpg,png,pdf,docx',
      'Allowed file types',
    );

    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'STRIPE.ENABLED',
      'false',
      'Stripe integration enabled',
    );
    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'STRIPE.API_KEY',
      '',
      'Stripe API Key',
      true,
      true,
    );
    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'STRIPE.SETTINGS',
      JSON.stringify({ currency: 'USD', environment: 'test' }),
      'Stripe settings (JSON)',
    );

    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'SENDGRID.ENABLED',
      'false',
      'SendGrid integration enabled',
    );
    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'SENDGRID.API_KEY',
      '',
      'SendGrid API Key',
      true,
      true,
    );
    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'SENDGRID.SETTINGS',
      JSON.stringify({ sender: 'noreply@hotel.com' }),
      'SendGrid settings (JSON)',
    );

    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'BOOKING.ENABLED',
      'false',
      'Booking.com integration enabled',
    );
    await this.setIfMissing(
      ConfigCategory.INTEGRATION,
      'BOOKING.SETTINGS',
      JSON.stringify({ commission: '15%' }),
      'Booking.com settings (JSON)',
    );
  }
}

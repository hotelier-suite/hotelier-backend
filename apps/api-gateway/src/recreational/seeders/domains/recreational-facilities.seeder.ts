import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecreationalFacility } from '../../entities/recreational-facility.entity';
import { FacilityType } from '../../enums/facility-type.enum';
import { FacilityStatus } from '../../enums/facility-status.enum';

@Injectable()
export class RecreationalFacilitiesSeeder {
  constructor(
    @InjectRepository(RecreationalFacility)
    private readonly facilityRepository: Repository<RecreationalFacility>,
  ) {}

  async seed() {
    const existingCount = await this.facilityRepository.count();
    if (existingCount > 0) {
      console.log('⏭️ Recreational facilities already exist, skipping seeding');
      return;
    }

    const facilities = [
      {
        name: 'Olympic Swimming Pool',
        type: FacilityType.SWIMMING_POOL,
        status: FacilityStatus.AVAILABLE,
        capacity: 25,
        area: 500.0,
        location: 'Wellness Center - Ground Floor',
        description:
          'Professional 50-meter pool with 8 lanes, heated water and poolside amenities. Perfect for swimming, aqua aerobics and recreation.',
        hourlyRate: 15.0,
        isAvailable: true,
        openingTime: '06:00',
        closingTime: '22:00',
        minimumBookingHours: 1,
        maximumBookingHours: 4,
        amenities: [
          'Pool towels',
          'Changing rooms',
          'Showers',
          'Pool chairs',
          'Lifeguard on duty',
        ],
        rules: [
          'Swimming cap required',
          'Children under 12 must be supervised',
          'No outside food or drinks allowed',
          'Maximum 2 continuous hours during peak hours',
        ],
        advanceBookingHours: 2,
        availableDays: [1, 2, 3, 4, 5, 6, 0], // All days
        maintenanceNotes:
          'Daily cleaning 5:00-6:00 AM, weekly chemical check Sundays 5:00-7:00 AM',
      },
      {
        name: 'Full-Service Gym',
        type: FacilityType.GYM,
        status: FacilityStatus.AVAILABLE,
        capacity: 15,
        area: 300.0,
        location: 'Wellness Center - Second Floor',
        description:
          'Fully equipped gym with cardio machines, free weights and strength training equipment. Personal training available.',
        hourlyRate: 10.0,
        isAvailable: true,
        openingTime: '05:00',
        closingTime: '23:00',
        minimumBookingHours: 1,
        maximumBookingHours: 3,
        amenities: [
          'Towel service',
          'Water station',
          'Changing rooms',
          'Lockers',
          'Sound system',
        ],
        rules: [
          'Appropriate athletic wear required',
          'Wipe down equipment after use',
          'No personal music without headphones',
          'Maximum 3-hour sessions',
        ],
        advanceBookingHours: 1,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes: 'Equipment maintenance every Tuesday 2:00-4:00 AM',
      },
      {
        name: 'Professional Tennis Court',
        type: FacilityType.TENNIS_COURT,
        status: FacilityStatus.AVAILABLE,
        capacity: 4,
        area: 648.0,
        location: 'Sports Complex - Outdoor',
        description:
          'Professional hard-surface tennis court with night lighting. Equipment rental available at reception.',
        hourlyRate: 20.0,
        isAvailable: true,
        openingTime: '07:00',
        closingTime: '21:00',
        minimumBookingHours: 1,
        maximumBookingHours: 3,
        amenities: [
          'Night lighting',
          'Equipment rental',
          'Water dispenser',
          'Rest area',
        ],
        rules: [
          'Tennis shoes required',
          'Court shoes only (no running shoes)',
          'Maximum 4 players',
          'No food allowed on court',
        ],
        advanceBookingHours: 4,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes: 'Annual surface resurfacing, weekly net inspection',
      },
      {
        name: 'Premium Luxury Spa',
        type: FacilityType.SPA,
        status: FacilityStatus.AVAILABLE,
        capacity: 2,
        area: 80.0,
        location: 'Wellness Center - Third Floor',
        description:
          'Private spa suite with massage table, relaxation area and premium amenities for couples or individual treatments.',
        hourlyRate: 30.0,
        isAvailable: true,
        openingTime: '09:00',
        closingTime: '20:00',
        minimumBookingHours: 1,
        maximumBookingHours: 4,
        amenities: [
          'Massage table',
          'Essential oils',
          'Relaxing music',
          'Robes and slippers',
          'Herbal tea service',
        ],
        rules: [
          'Advance booking required',
          'Arrive 10 minutes early',
          'No mobile phones',
          'Quiet atmosphere',
        ],
        advanceBookingHours: 24,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes:
          'Deep cleaning after each session, equipment sanitization',
      },
      {
        name: 'Traditional Finnish Sauna',
        type: FacilityType.SAUNA,
        status: FacilityStatus.AVAILABLE,
        capacity: 8,
        area: 25.0,
        location: 'Wellness Center - Ground Floor',
        description:
          'Traditional Finnish sauna with dry heat therapy. Towels and cooling area included.',
        hourlyRate: 12.0,
        isAvailable: true,
        openingTime: '08:00',
        closingTime: '22:00',
        minimumBookingHours: 1,
        maximumBookingHours: 2,
        amenities: [
          'Towel service',
          'Cooling shower',
          'Relaxation seating',
          'Temperature control',
        ],
        rules: [
          'Towels required at all times',
          'Maximum 2 hours continuous use',
          'Shower before entering',
          'No electronic devices',
        ],
        advanceBookingHours: 2,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes:
          'Daily temperature check and cleaning, weekly deep sanitization',
      },
      {
        name: 'Rooftop View Jacuzzi',
        type: FacilityType.JACUZZI,
        status: FacilityStatus.AVAILABLE,
        capacity: 6,
        area: 15.0,
        location: 'Rooftop Terrace',
        description:
          'Outdoor jacuzzi with stunning city views. Perfect for relaxation and romantic evenings.',
        hourlyRate: 18.0,
        isAvailable: true,
        openingTime: '10:00',
        closingTime: '23:00',
        minimumBookingHours: 1,
        maximumBookingHours: 3,
        amenities: [
          'City views',
          'Underwater lighting',
          'Temperature control',
          'Towel service',
        ],
        rules: [
          'Swimwear required',
          'Maximum 6 people',
          'No glass containers',
          'Children under supervision',
        ],
        advanceBookingHours: 3,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes:
          'Chemical balance checked twice daily, weekly filter cleaning',
      },
      {
        name: 'Multi-Purpose Game Room',
        type: FacilityType.GAME_ROOM,
        status: FacilityStatus.AVAILABLE,
        capacity: 12,
        area: 120.0,
        location: 'Recreation Center - Ground Floor',
        description:
          'Entertainment room with pool table, air hockey, ping pong, video game consoles and comfortable lounge area.',
        hourlyRate: 8.0,
        isAvailable: true,
        openingTime: '09:00',
        closingTime: '24:00',
        minimumBookingHours: 1,
        maximumBookingHours: 4,
        amenities: [
          'Pool table',
          'Air hockey',
          'Ping pong table',
          'Gaming consoles',
          'Comfortable seating',
          'Snack area',
        ],
        rules: [
          'Keep area clean',
          'Return equipment after use',
          'Respect other guests',
          'No outside food',
        ],
        advanceBookingHours: 1,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes: 'Weekly equipment check, daily deep cleaning',
      },
      {
        name: 'Yoga and Meditation Studio',
        type: FacilityType.YOGA_STUDIO,
        status: FacilityStatus.AVAILABLE,
        capacity: 20,
        area: 150.0,
        location: 'Wellness Center - Second Floor',
        description:
          'Tranquil yoga and meditation studio with mirrors, mats and props. Perfect for group classes or private practice.',
        hourlyRate: 10.0,
        isAvailable: true,
        openingTime: '06:00',
        closingTime: '21:00',
        minimumBookingHours: 1,
        maximumBookingHours: 3,
        amenities: [
          'Yoga mats',
          'Meditation cushions',
          'Mirrors',
          'Sound system',
          'Props available',
        ],
        rules: [
          'Quiet atmosphere',
          'No shoes on mats',
          'Clean mats after use',
          'Respectful behavior',
        ],
        advanceBookingHours: 2,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes:
          'Mat sanitization after each session, weekly deep cleaning',
      },
      {
        name: 'Kids Play Area',
        type: FacilityType.KIDS_PLAY_AREA,
        status: FacilityStatus.AVAILABLE,
        capacity: 15,
        area: 100.0,
        location: 'Family Center - Ground Floor',
        description:
          'Safe and fun play area for children with slides, ball pit, toys and supervised activities.',
        hourlyRate: 5.0,
        isAvailable: true,
        openingTime: '09:00',
        closingTime: '19:00',
        minimumBookingHours: 1,
        maximumBookingHours: 3,
        amenities: [
          'Play equipment',
          'Toys',
          'Safety mats',
          'Hand sanitizer stations',
          'Parent seating',
        ],
        rules: [
          'Children must be supervised',
          'Age limit 12 years',
          'No food in play area',
          'Socks required',
        ],
        advanceBookingHours: 1,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes: 'Daily sanitization, weekly equipment safety check',
      },
      {
        name: 'Executive Business Center',
        type: FacilityType.BUSINESS_CENTER,
        status: FacilityStatus.AVAILABLE,
        capacity: 8,
        area: 60.0,
        location: 'Main Building - Mezzanine',
        description:
          'Fully equipped business center with computers, printers, meeting space and high-speed internet.',
        hourlyRate: 8.0,
        isAvailable: true,
        openingTime: '06:00',
        closingTime: '22:00',
        minimumBookingHours: 1,
        maximumBookingHours: 8,
        amenities: [
          'Computers',
          'Printers',
          'Scanner',
          'High-speed WiFi',
          'Meeting table',
          'Office supplies',
        ],
        rules: [
          'Professional use only',
          'No food near equipment',
          'Save work before leaving',
          'Respect others working',
        ],
        advanceBookingHours: 1,
        availableDays: [1, 2, 3, 4, 5, 6, 0],
        maintenanceNotes: 'Monthly equipment update, twice daily cleaning',
      },
    ];

    for (const facilityData of facilities) {
      const facility = this.facilityRepository.create(facilityData);
      await this.facilityRepository.save(facility);
    }

    console.log(`✨ Created ${facilities.length} recreational facilities`);
  }
}

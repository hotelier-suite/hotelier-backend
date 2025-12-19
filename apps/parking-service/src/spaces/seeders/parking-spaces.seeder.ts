import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSpace } from '../entities/parking-space.entity';
import { SpaceType } from '@app/contracts/parking-service/spaces/enums/space-type.enum';
import { SpaceStatus } from '@app/contracts/parking-service/spaces/enums/space-status.enum';

@Injectable()
export class ParkingSpacesSeeder {
  constructor(
    @InjectRepository(ParkingSpace)
    private parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  async seed() {
    const parkingSpaces = [
      // Guest Parking - Ground Floor
      {
        code: 'G-001',
        zone: 'Ground Floor',
        type: SpaceType.GUEST,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 5.0,
        location: 'Ground Floor - Row A',
      },
      {
        code: 'G-002',
        zone: 'Ground Floor',
        type: SpaceType.GUEST,
        status: SpaceStatus.OCCUPIED,
        currentVehicle: 'ABC-123',
        hourlyRate: 5.0,
        location: 'Ground Floor - Row A',
      },
      {
        code: 'G-003',
        zone: 'Ground Floor',
        type: SpaceType.GUEST,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 5.0,
        location: 'Ground Floor - Row A',
      },

      // VIP Parking
      {
        code: 'VIP-001',
        zone: 'VIP Section',
        type: SpaceType.VIP,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 15.0,
        location: 'Ground Floor - VIP Area',
      },
      {
        code: 'VIP-002',
        zone: 'VIP Section',
        type: SpaceType.VIP,
        status: SpaceStatus.RESERVED,
        hourlyRate: 15.0,
        location: 'Ground Floor - VIP Area',
      },

      // Accessible Parking
      {
        code: 'DIS-001',
        zone: 'Accessibility',
        type: SpaceType.DISABLED,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 0.0,
        location: 'Ground Floor - Near Entrance',
      },
      {
        code: 'DIS-002',
        zone: 'Accessibility',
        type: SpaceType.DISABLED,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 0.0,
        location: 'Ground Floor - Near Entrance',
      },

      // Employee Parking
      {
        code: 'EMP-001',
        zone: 'Employee Area',
        type: SpaceType.EMPLOYEE,
        status: SpaceStatus.OCCUPIED,
        currentVehicle: 'EMP-456',
        hourlyRate: 0.0,
        location: 'Basement - Level B1',
      },
      {
        code: 'EMP-002',
        zone: 'Employee Area',
        type: SpaceType.EMPLOYEE,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 0.0,
        location: 'Basement - Level B1',
      },

      // Visitor Parking
      {
        code: 'VIS-001',
        zone: 'Visitor Area',
        type: SpaceType.VISITOR,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 3.0,
        location: 'Ground Floor - Row C',
      },

      // Loading Zone
      {
        code: 'LOAD-001',
        zone: 'Service Area',
        type: SpaceType.LOADING,
        status: SpaceStatus.AVAILABLE,
        hourlyRate: 0.0,
        location: 'Ground Floor - Loading Dock',
      },

      // Maintenance
      {
        code: 'G-004',
        zone: 'Ground Floor',
        type: SpaceType.GUEST,
        status: SpaceStatus.MAINTENANCE,
        hourlyRate: 5.0,
        location: 'Ground Floor - Row B',
      },
    ];

    for (const spaceData of parkingSpaces) {
      const existing = await this.parkingSpaceRepository.findOne({
        where: { code: spaceData.code },
      });

      if (!existing) {
        await this.parkingSpaceRepository.save(spaceData);
      }
    }
  }
}

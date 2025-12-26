import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingIncident } from '../entities';
import { Vehicle } from '../../vehicles';
import { ParkingSpace } from '../../spaces';
import { IncidentType, IncidentStatus } from '@app/contracts/parking-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class ParkingIncidentsSeeder {
  constructor(
    @InjectRepository(ParkingIncident)
    private incidentRepository: Repository<ParkingIncident>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingSpace)
    private parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  async seed() {
    const vehicles = await this.vehicleRepository.find({ take: 3 });
    const parkingSpaces = await this.parkingSpaceRepository.find({ take: 3 });

    const incidents = [
      {
        type: IncidentType.VEHICLE_DAMAGE,
        description:
          'Minor scratch on rear bumper, possibly caused by another vehicle',
        reportDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        status: IncidentStatus.RESOLVED,
        responsible: 'Security Team',
        priority: TaskPriority.NORMAL,
        resolution:
          'Incident documented, vehicle owner notified, insurance contacted',
        resolvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        vehicleId: vehicles[0]?.id,
        spaceId: parkingSpaces[0]?.id,
      },
      {
        type: IncidentType.SECURITY,
        description: 'Unauthorized vehicle parked in VIP space without permit',
        reportDate: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: IncidentStatus.IN_PROGRESS,
        responsible: 'Security Guard',
        priority: TaskPriority.HIGH,
        vehicleId: vehicles[1]?.id,
        spaceId: parkingSpaces[1]?.id,
      },
      {
        type: IncidentType.INFRASTRUCTURE,
        description: 'Parking barrier failure - not opening automatically',
        reportDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: IncidentStatus.PENDING,
        responsible: 'Maintenance Team',
        priority: TaskPriority.HIGH,
        spaceId: parkingSpaces[2]?.id,
      },
      {
        type: IncidentType.ACCIDENT,
        description: 'Minor collision between two vehicles during parking',
        reportDate: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        status: IncidentStatus.RESOLVED,
        responsible: 'Security Manager',
        priority: TaskPriority.URGENT,
        resolution:
          'Both parties insurance contacted, parking space temporarily closed for investigation',
        resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
      },
      {
        type: IncidentType.OTHER,
        description: 'Guest locked keys inside vehicle, requested assistance',
        reportDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: IncidentStatus.RESOLVED,
        responsible: 'Front Desk',
        priority: TaskPriority.NORMAL,
        resolution: 'Locksmith contacted, vehicle opened, guest assisted',
        resolvedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        vehicleId: vehicles[0]?.id,
      },
    ];

    for (const incidentData of incidents) {
      const existing = await this.incidentRepository.findOne({
        where: {
          type: incidentData.type,
          description: incidentData.description,
        },
      });

      if (!existing) {
        await this.incidentRepository.save(incidentData);
      }
    }
  }
}

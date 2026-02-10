import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities';
import { ParkingSpace } from '../../spaces';
import {
  VehicleType,
  GuestType,
  VehicleStatus,
} from '@app/contracts/parking-service';

@Injectable()
export class VehiclesSeeder {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingSpace)
    private parkingSpaceRepository: Repository<ParkingSpace>,
  ) {}

  async seed() {
    const vehicles = [
      {
        licensePlate: 'ABC-123',
        brand: 'Toyota',
        model: 'Camry',
        color: 'Blue',
        type: VehicleType.CAR,
        owner: 'John Smith',
        room: '201',
        guestType: GuestType.GUEST,
        assignedSpace: 'G-002',
        entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: VehicleStatus.PARKED,
        notes: 'Guest vehicle - checkout tomorrow',
      },
      {
        licensePlate: 'EMP-456',
        brand: 'Honda',
        model: 'Civic',
        color: 'White',
        type: VehicleType.CAR,
        owner: 'Mary Johnson',
        guestType: GuestType.EMPLOYEE,
        assignedSpace: 'EMP-001',
        entryTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        status: VehicleStatus.PARKED,
        notes: 'Employee parking',
      },
      {
        licensePlate: 'XYZ-789',
        brand: 'BMW',
        model: 'X5',
        color: 'Black',
        type: VehicleType.CAR,
        owner: 'Robert Johnson',
        room: '305',
        guestType: GuestType.GUEST,
        entryTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        exitTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: VehicleStatus.EXITED,
        notes: 'VIP guest - checked out',
      },
      {
        licensePlate: 'MOTO-123',
        brand: 'Yamaha',
        model: 'MT-07',
        color: 'Red',
        type: VehicleType.MOTORCYCLE,
        owner: 'James Smith',
        guestType: GuestType.VISITOR,
        entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: VehicleStatus.PARKED,
        notes: 'Visitor motorcycle',
      },
      {
        licensePlate: 'VAN-456',
        brand: 'Ford',
        model: 'Transit',
        color: 'White',
        type: VehicleType.VAN,
        owner: 'Delivery Service Co.',
        guestType: GuestType.SUPPLIER,
        assignedSpace: 'LOAD-001',
        entryTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: VehicleStatus.PARKED,
        notes: 'Supply delivery - temporary parking',
      },
    ];

    for (const vehicleData of vehicles) {
      const existing = await this.vehicleRepository.findOne({
        where: { licensePlate: vehicleData.licensePlate },
      });

      if (!existing) {
        await this.vehicleRepository.save(vehicleData);
      }
    }
  }
}

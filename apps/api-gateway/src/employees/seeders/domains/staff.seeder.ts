import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { Department } from '../../enums/department.enum';
import { StaffStatus } from '../../enums/staff-status.enum';

@Injectable()
export class StaffSeeder {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async seed() {
    const staffMembers = [
      {
        employeeId: 'STF001',
        name: 'Emily Morrison',
        email: 'emily.morrison@hotelier.com',
        phone: '+1234567800',
        department: Department.HOUSEKEEPING,
        position: 'Head of Housekeeping',
        salary: 4500.0,
        hireDate: new Date('2022-01-15'),
        status: StaffStatus.ACTIVE,
        schedule: 'Monday to Friday, 6:00 AM - 2:00 PM',
      },
      {
        employeeId: 'STF002',
        name: 'Michael Turner',
        email: 'michael.turner@hotelier.com',
        phone: '+1234567801',
        department: Department.FRONT_DESK,
        position: 'Front Desk Manager',
        salary: 5000.0,
        hireDate: new Date('2021-08-10'),
        status: StaffStatus.ACTIVE,
        schedule: 'Monday to Friday, 8:00 AM - 4:00 PM',
      },
      {
        employeeId: 'STF003',
        name: 'Catherine Johnson',
        email: 'catherine.johnson@hotelier.com',
        phone: '+1234567802',
        department: Department.RESTAURANT,
        position: 'Restaurant Manager',
        salary: 4800.0,
        hireDate: new Date('2021-11-20'),
        status: StaffStatus.ACTIVE,
        schedule: 'Tuesday to Saturday, 2:00 PM - 10:00 PM',
      },
      {
        employeeId: 'STF004',
        name: 'Daniel Roberts',
        email: 'daniel.roberts@hotelier.com',
        phone: '+1234567803',
        department: Department.MAINTENANCE,
        position: 'Maintenance Manager',
        salary: 4200.0,
        hireDate: new Date('2020-05-12'),
        status: StaffStatus.ACTIVE,
        schedule: 'Monday to Friday, 7:00 AM - 3:00 PM',
      },
      {
        employeeId: 'STF005',
        name: 'Isabella Williams',
        email: 'isabella.williams@hotelier.com',
        phone: '+1234567804',
        department: Department.MANAGEMENT,
        position: 'Administrator',
        salary: 5200.0,
        hireDate: new Date('2022-03-01'),
        status: StaffStatus.ACTIVE,
        schedule: 'Monday to Friday, 9:00 AM - 5:00 PM',
      },
    ];

    for (const staffData of staffMembers) {
      const existingStaff = await this.staffRepository.findOne({
        where: { employeeId: staffData.employeeId },
      });

      if (!existingStaff) {
        await this.staffRepository.save(staffData);
      }
    }
  }
}

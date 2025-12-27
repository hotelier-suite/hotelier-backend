import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestRequest } from '../entities';
import {
  GuestRequestType,
  GuestRequestStatus,
  RequestPriority,
} from '@app/contracts/guest-requests-service';

@Injectable()
export class GuestRequestsSeeder {
  constructor(
    @InjectRepository(GuestRequest)
    private guestRequestRepository: Repository<GuestRequest>,
  ) {}

  async seed() {
    const requests = [
      {
        room: '301',
        guestName: 'Sarah Johnson',
        type: GuestRequestType.TOWELS,
        description:
          'Please provide extra bath towels and pool towels for family of 4',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.LOW,
        time: new Date('2024-12-08 14:30:00'),
        completedAt: new Date('2024-12-08 15:15:00'),
        assignedTo: 'Mary Williams',
        notes: 'Delivered 6 bath towels and 4 pool towels as requested',
      },
      {
        room: '507',
        guestName: 'Michael Chen',
        type: GuestRequestType.ROOM_SERVICE,
        description:
          'Order dinner for 2: Grilled salmon, Caesar salad and a bottle of Chardonnay',
        status: GuestRequestStatus.IN_PROGRESS,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 18:45:00'),
        assignedTo: 'Restaurant Staff',
        notes: 'Order confirmed, estimated delivery time 7:30 PM',
      },
      {
        room: '203',
        guestName: 'Emily Johnson',
        type: GuestRequestType.MAINTENANCE,
        description:
          'Air conditioning not working properly, room temperature too hot',
        status: GuestRequestStatus.PENDING,
        priority: RequestPriority.HIGH,
        time: new Date('2024-12-08 19:20:00'),
        assignedTo: 'Maintenance Team',
        notes: 'Technician dispatched, should arrive in 30 minutes',
      },
      {
        room: '1205',
        guestName: 'Robert Wilson',
        type: GuestRequestType.HOUSEKEEPING,
        description:
          'Request early housekeeping service at 8 AM for business meeting preparation',
        status: GuestRequestStatus.PENDING,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 20:15:00'),
        assignedTo: 'Housekeeping Supervisor',
        notes: 'Scheduled for tomorrow 8:00 AM, VIP level service',
      },
      {
        room: '802',
        guestName: 'Lisa Thompson',
        type: GuestRequestType.CONCIERGE,
        description:
          'Need assistance booking tickets for local theater show and restaurant recommendations',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 16:00:00'),
        completedAt: new Date('2024-12-08 17:30:00'),
        assignedTo: 'James Miller - Concierge',
        notes:
          'Tickets booked for "Romeo and Juliet" and reservation made at Le Bernardin',
      },
      {
        room: '404',
        guestName: 'David Kim',
        type: GuestRequestType.TECHNICAL_SUPPORT,
        description:
          'Wi-Fi connection issues, cannot connect laptop for video conference',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.URGENT,
        time: new Date('2024-12-08 10:30:00'),
        completedAt: new Date('2024-12-08 11:00:00'),
        assignedTo: 'IT Support',
        notes: 'Router reset and provided premium Wi-Fi access code to guest',
      },
      {
        room: '609',
        guestName: 'Amanda Davis',
        type: GuestRequestType.OTHER,
        description: 'Request for crib and baby items for 18-month-old child',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 13:45:00'),
        completedAt: new Date('2024-12-08 14:30:00'),
        assignedTo: 'Concierge Staff',
        notes:
          'Crib delivered, baby blankets, bottle warmer and baby welcome basket',
      },
      {
        room: '1101',
        guestName: 'Thomas Anderson',
        type: GuestRequestType.CONCIERGE,
        description:
          'Airport transportation service needed for early flight at 6 AM',
        status: GuestRequestStatus.PENDING,
        priority: RequestPriority.HIGH,
        time: new Date('2024-12-08 21:00:00'),
        assignedTo: 'Transportation Coordinator',
        notes: 'Luxury sedan booked for 4:30 AM pickup, driver confirmed',
      },
      {
        room: '715',
        guestName: 'Jennifer Smith',
        type: GuestRequestType.HOUSEKEEPING,
        description:
          'Allergic to feather pillows, need hypoallergenic bedding alternatives',
        status: GuestRequestStatus.COMPLETED,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 12:15:00'),
        completedAt: new Date('2024-12-08 13:00:00'),
        assignedTo: 'Housekeeping Supervisor',
        notes:
          'Replaced all bedding with hypoallergenic alternatives, guest satisfaction confirmed',
      },
      {
        room: '318',
        guestName: 'Christopher Lee',
        type: GuestRequestType.MAINTENANCE,
        description: 'Bathroom shower has low water pressure',
        status: GuestRequestStatus.IN_PROGRESS,
        priority: RequestPriority.MEDIUM,
        time: new Date('2024-12-08 17:45:00'),
        assignedTo: 'Plumbing Specialist',
        notes:
          'Investigating issue, may need access to adjacent rooms for full diagnosis',
      },
    ];

    for (const requestData of requests) {
      const existing = await this.guestRequestRepository.findOne({
        where: {
          room: requestData.room,
          guestName: requestData.guestName,
          type: requestData.type,
        },
      });

      if (!existing) {
        await this.guestRequestRepository.save(requestData);
      }
    }

    console.log('✅ Guest requests populated');
  }
}

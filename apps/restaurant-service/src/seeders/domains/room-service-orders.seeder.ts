import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomServiceOrder } from '../../room-service-orders';
import { RoomServiceStatus } from '@app/contracts/restaurant-service';

@Injectable()
export class RoomServiceOrdersSeeder {
  constructor(
    @InjectRepository(RoomServiceOrder)
    private orderRepository: Repository<RoomServiceOrder>,
  ) {}

  async seed() {
    const orders = [
      {
        orderNumber: 'RS-2024-001',
        room: '201',
        guest: 'John Smith',
        items: [
          {
            item: 'Club Sandwich',
            quantity: 1,
            price: 18.5,
            notes: 'No tomatoes',
          },
          {
            item: 'French Fries',
            quantity: 1,
            price: 8.0,
          },
          {
            item: 'Coca Cola',
            quantity: 2,
            price: 3.5,
          },
        ],
        total: 33.5,
        orderTime: '14:30',
        estimatedTime: '25 minutes',
        status: RoomServiceStatus.DELIVERED,
        waiter: 'Amanda Davis',
        specialInstructions: 'Guest has nut allergy',
      },
      {
        orderNumber: 'RS-2024-002',
        room: '305',
        guest: 'Mary Williams',
        items: [
          {
            item: 'Caesar Salad',
            quantity: 1,
            price: 15.0,
          },
          {
            item: 'Grilled Chicken',
            quantity: 1,
            price: 22.5,
          },
          {
            item: 'White Wine',
            quantity: 1,
            price: 12.0,
          },
        ],
        total: 49.5,
        orderTime: '19:15',
        estimatedTime: '35 minutes',
        status: RoomServiceStatus.PREPARING,
        waiter: 'James Smith',
        specialInstructions: 'Birthday celebration - add candle to dessert',
      },
      {
        orderNumber: 'RS-2024-003',
        room: '108',
        guest: 'Robert Johnson',
        items: [
          {
            item: 'Room Service Breakfast',
            quantity: 2,
            price: 25.0,
          },
          {
            item: 'Orange Juice',
            quantity: 2,
            price: 4.5,
          },
          {
            item: 'Coffee',
            quantity: 2,
            price: 3.0,
          },
        ],
        total: 65.0,
        orderTime: '08:00',
        estimatedTime: '20 minutes',
        status: RoomServiceStatus.PENDING,
        specialInstructions: 'Please deliver at exactly 8:30 AM',
      },
    ];

    for (const orderData of orders) {
      const existing = await this.orderRepository.findOne({
        where: { orderNumber: orderData.orderNumber },
      });

      if (!existing) {
        await this.orderRepository.save(orderData);
      }
    }
  }
}

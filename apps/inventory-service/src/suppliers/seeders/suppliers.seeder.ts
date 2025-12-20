import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SuppliersSeeder {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async seed(): Promise<void> {
    const suppliers: Array<
      Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'inventoryItems'>
    > = [
      {
        name: 'Premium Linen Suppliers',
        contact: 'Mary Graham',
        email: 'contact@premiumlinen.com',
        phone: '+1 555 345 6789',
        address: '123 Textile Street, Miami, FL',
        category: 'General',
        rating: 4.0,
        deliveryTime: '3-5 days',
        paymentTerms: '30 days',
      },
      {
        name: 'Hotel Amenities Inc.',
        contact: 'James Johnson',
        email: 'sales@hotelamenities.com',
        phone: '+1 555 456 7890',
        address: '456 Hospitality Avenue, Orlando, FL',
        category: 'General',
        rating: 4.0,
        deliveryTime: '3-5 days',
        paymentTerms: '30 days',
      },
      {
        name: 'CleanPro Supplies',
        contact: 'Emily Smith',
        email: 'orders@cleanprosupplies.com',
        phone: '+1 555 567 8901',
        address: '789 Industrial Park South, Tampa, FL',
        category: 'General',
        rating: 4.0,
        deliveryTime: '3-5 days',
        paymentTerms: '30 days',
      },
      {
        name: 'Direct Electronics',
        contact: 'David Brown',
        email: 'info@directelectronics.com',
        phone: '+1 555 678 9012',
        address: '321 Tech Mall Center, Jacksonville, FL',
        category: 'General',
        rating: 4.0,
        deliveryTime: '3-5 days',
        paymentTerms: '30 days',
      },
    ];

    for (const supplierData of suppliers) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { name: supplierData.name },
      });

      if (!existingSupplier) {
        await this.supplierRepository.save(supplierData);
      }
    }
  }
}

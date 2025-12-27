import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../menu-items';

@Injectable()
export class MenuItemsSeeder {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async seed() {
    const menuItems = [
      // Appetizers
      {
        itemCode: 'APP001',
        category: 'Appetizers',
        name: 'Bruschetta',
        description: 'Toasted bread with fresh tomatoes, garlic, and basil',
        price: 12.5,
        available: true,
        preparationTime: '10 minutes',
        ingredients: ['bread', 'tomatoes', 'garlic', 'basil', 'olive oil'],
        allergens: ['gluten'],
      },
      {
        itemCode: 'APP002',
        category: 'Appetizers',
        name: 'Calamari Rings',
        description: 'Crispy fried squid rings with marinara sauce',
        price: 15.0,
        available: true,
        preparationTime: '12 minutes',
        ingredients: ['squid', 'flour', 'spices', 'marinara sauce'],
        allergens: ['gluten', 'seafood'],
      },
      // Main Courses
      {
        itemCode: 'MAIN001',
        category: 'Main Courses',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce',
        price: 28.5,
        available: true,
        preparationTime: '20 minutes',
        ingredients: ['salmon', 'lemon', 'butter', 'herbs'],
        allergens: ['fish', 'dairy'],
      },
      {
        itemCode: 'MAIN002',
        category: 'Main Courses',
        name: 'Beef Tenderloin',
        description: 'Prime cut beef with red wine reduction',
        price: 35.0,
        available: true,
        preparationTime: '25 minutes',
        ingredients: ['beef tenderloin', 'red wine', 'shallots', 'butter'],
        allergens: ['dairy'],
      },
      {
        itemCode: 'MAIN003',
        category: 'Main Courses',
        name: 'Vegetarian Pasta',
        description: 'Penne with roasted vegetables and pesto sauce',
        price: 18.5,
        available: true,
        preparationTime: '15 minutes',
        ingredients: [
          'penne pasta',
          'zucchini',
          'peppers',
          'pesto',
          'parmesan',
        ],
        allergens: ['gluten', 'dairy', 'nuts'],
      },
      // Desserts
      {
        itemCode: 'DES001',
        category: 'Desserts',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 8.5,
        available: true,
        preparationTime: '5 minutes',
        ingredients: ['ladyfingers', 'coffee', 'mascarpone', 'cocoa'],
        allergens: ['gluten', 'dairy', 'eggs'],
      },
      {
        itemCode: 'DES002',
        category: 'Desserts',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with berry compote',
        price: 9.0,
        available: true,
        preparationTime: '5 minutes',
        ingredients: ['chocolate', 'flour', 'eggs', 'berries'],
        allergens: ['gluten', 'dairy', 'eggs'],
      },
      // Beverages
      {
        itemCode: 'BEV001',
        category: 'Beverages',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.5,
        available: true,
        preparationTime: '3 minutes',
        ingredients: ['fresh oranges'],
        allergens: [],
      },
      {
        itemCode: 'BEV002',
        category: 'Beverages',
        name: 'House Wine Red',
        description: 'Premium house red wine selection',
        price: 12.0,
        available: true,
        preparationTime: '2 minutes',
        ingredients: ['red wine'],
        allergens: ['sulfites'],
      },
    ];

    for (const itemData of menuItems) {
      const existing = await this.menuItemRepository.findOne({
        where: { itemCode: itemData.itemCode },
      });

      if (!existing) {
        await this.menuItemRepository.save(itemData);
      }
    }
  }
}

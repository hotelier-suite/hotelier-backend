import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardWidget } from '../../widgets';

@Injectable()
export class WidgetsSeeder {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.widgetRepository.count();
    if (count > 0) {
      console.log('  ⏭️  Widgets already seeded, skipping...');
      return;
    }

    console.log('  🔧 Seeding dashboard widgets...');

    const widgets: Partial<DashboardWidget>[] = [
      {
        title: 'Room Occupancy',
        type: 'chart',
        configuration: { chartType: 'line', dataSource: 'occupancy' },
        position: 0,
        visible: true,
        userId: 1,
      },
      {
        title: 'Revenue Overview',
        type: 'chart',
        configuration: { chartType: 'bar', dataSource: 'revenue' },
        position: 1,
        visible: true,
        userId: 1,
      },
      {
        title: "Today's Check-ins",
        type: 'stat',
        configuration: { dataSource: 'checkIns', color: 'green' },
        position: 2,
        visible: true,
        userId: 1,
      },
      {
        title: 'Pending Requests',
        type: 'stat',
        configuration: { dataSource: 'pendingRequests', color: 'orange' },
        position: 3,
        visible: true,
        userId: 1,
      },
      {
        title: 'Recent Activities',
        type: 'list',
        configuration: { dataSource: 'activities', limit: 10 },
        position: 4,
        visible: true,
        userId: 1,
      },
      {
        title: 'Top Performing Rooms',
        type: 'table',
        configuration: { dataSource: 'topRooms', limit: 5 },
        position: 5,
        visible: true,
        userId: 1,
      },
    ];

    await this.widgetRepository.save(widgets);
    console.log(`  ✅ Seeded ${widgets.length} dashboard widgets`);
  }
}

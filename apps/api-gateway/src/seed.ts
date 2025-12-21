import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedersService as RestaurantSeedersService } from './restaurant/seeders/seeders.service';
import { SeedersService as EventsSeedersService } from './events/seeders/seeders.service';
import { SeedersService as RecreationalSeedersService } from './recreational/seeders/seeders.service';
import { SeedersService as VenuesSeedersService } from './venues/seeders/seeders.service';
import { SeedersService as HousekeepingSeedersService } from './housekeeping/seeders/seeders.service';
import { SeedersService as BillingSeedersService } from './billing/seeders/seeders.service';
import { SeedersService as MaintenanceSeedersService } from './maintenance/seeders/seeders.service';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Core Business Entities

    // Venues first (many other entities depend on venues)
    const venuesSeeder = app.get(VenuesSeedersService);
    await venuesSeeder.seed();

    // Restaurant services
    const restaurantSeeder = app.get(RestaurantSeedersService);
    await restaurantSeeder.seed();

    // Events
    const eventsSeeder = app.get(EventsSeedersService);
    await eventsSeeder.seed();

    // Recreational facilities and bookings
    const recreationalSeeder = app.get(RecreationalSeedersService);
    await recreationalSeeder.seed();

    // Operations

    // Housekeeping
    const housekeepingSeeder = app.get(HousekeepingSeedersService);
    await housekeepingSeeder.seed();

    // Maintenance
    const maintenanceSeeder = app.get(MaintenanceSeedersService);
    await maintenanceSeeder.seed();

    // Financial

    // Billing
    const billingSeeder = app.get(BillingSeedersService);
    await billingSeeder.seed();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void runSeeds();
}

export default runSeeds;

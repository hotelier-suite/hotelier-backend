import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsSeeder } from './events.seeder';
import { Event } from '../entities';

describe('EventsSeeder', () => {
  let seeder: EventsSeeder;
  let repository: Record<string, jest.Mock>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsSeeder,
        { provide: getRepositoryToken(Event), useValue: repository },
      ],
    }).compile();

    seeder = module.get(EventsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed events when none exist', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.findOne).toHaveBeenCalledTimes(5);
    expect(repository.save).toHaveBeenCalledTimes(5);
  });

  it('should skip existing events', async () => {
    repository.findOne.mockResolvedValue({ id: 1, title: 'Existing' });
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.findOne).toHaveBeenCalledTimes(5);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should seed only missing events', async () => {
    repository.findOne
      .mockResolvedValueOnce({ id: 1, title: 'Existing' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 3, title: 'Existing' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.save).toHaveBeenCalledTimes(3);
  });
});

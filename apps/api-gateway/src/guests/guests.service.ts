import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Guest } from '../reservations/entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async findAll(query?: { search?: string }): Promise<Guest[]> {
    const where = query?.search
      ? [
          { name: ILike(`%${query.search}%`) },
          { email: ILike(`%${query.search}%`) },
          { phone: ILike(`%${query.search}%`) },
          { document: ILike(`%${query.search}%`) },
        ]
      : undefined;
    return this.guestRepository.find({ where, order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Guest> {
    return this.getGuest(id);
  }

  private async getGuest(id: number): Promise<Guest> {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) throw new NotFoundException(`Guest with id ${id} not found`);
    return guest;
  }

  async create(data: CreateGuestDto): Promise<Guest> {
    const saved = await this.guestRepository.save({ ...data });
    return saved;
  }

  async update(id: number, data: UpdateGuestDto): Promise<Guest> {
    await this.guestRepository.update(id, data);
    return this.getGuest(id);
  }

  async remove(id: number): Promise<Guest> {
    const guest = await this.getGuest(id);
    await this.guestRepository.remove(guest);
    return guest;
  }
}

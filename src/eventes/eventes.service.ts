import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventeDto } from './dto/create-evente.dto';
import { UpdateEventeDto } from './dto/update-evente.dto';
import { Evente } from './entities/evente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventesService {
  constructor(
    @InjectRepository(Evente)
    private readonly eventeRepository: Repository<Evente>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createEvent(createEventeDto: CreateEventeDto, user): Promise<Evente> {
    const event = this.eventeRepository.create({ ...createEventeDto });
    event.users = user;
    return this.eventeRepository.save(event, user);
  }

  async getEvents(user): Promise<Evente[]> {
    return await this.eventeRepository.find({
      where: { users: user },
      relations: ['tickets'],
    });
  }

  async findOne(id: string) {
    const event = await this.eventeRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return event;
  }

  async updateEvent(
    id: number,
    updateEventeDto: UpdateEventeDto,
    user,
  ): Promise<Evente> {
    const event = await this.eventeRepository.preload({
      id: +id,
      ...updateEventeDto,
    });
    if (!event) {
      throw new NotFoundException(`L'évenement d'id ${id} n'existe pas.`);
    }
    event.users = user;
    return this.eventeRepository.save(event, user);
  }

  async removeEvent(id: string) {
    const event = await this.findOne(id);
    return this.eventeRepository.remove(event);
  }

  async softDeleteEvent(id: string) {
    return await this.eventeRepository.softDelete(id);
  }

  async restoreEvent(id: string) {
    return this.eventeRepository.restore(id);
  }
}

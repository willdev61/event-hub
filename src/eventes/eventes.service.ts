import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventeDto } from './dto/create-evente.dto';
import { UpdateEventeDto } from './dto/update-evente.dto';
import { Evente } from './entities/evente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Injectable()
export class EventesService {
  constructor(
    @InjectRepository(Evente)
    private readonly eventeRepository: Repository<Evente>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createEvent(createEventeDto: CreateEventeDto, user): Promise<Evente> {
    const event = this.eventeRepository.create({ ...createEventeDto });
    event.users = user;
    return this.eventeRepository.save(event, user);
  }

  async getAllEvents(paginationQuery: PaginationQueryDto): Promise<Evente[]> {
    const { limit, offset } = paginationQuery;
    return await this.eventeRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async getEventUser() {
    const event = await this.dataSource
      .getRepository(Evente)
      .createQueryBuilder('evente.users')
      .where({})
      .getMany();
    return event;
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

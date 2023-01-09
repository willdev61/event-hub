import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventeDto } from './dto/create-evente.dto';
import { UpdateEventeDto } from './dto/update-evente.dto';
import { Evente } from './entities/evente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { FilterEventDto } from './dto/filter-event.dto';

@Injectable()
export class EventesService {
  constructor(
    @InjectRepository(Evente)
    private readonly eventeRepository: Repository<Evente>,
  ) {}

  async createEvent(
    createEventeDto: CreateEventeDto,
    user: any,
  ): Promise<Evente> {
    const event = this.eventeRepository.create({ ...createEventeDto });
    event.user = user;
    return this.eventeRepository.save(event, user);
  }

  async getAllEvents(paginationQuery: PaginationQueryDto): Promise<Evente[]> {
    const { limit, offset } = paginationQuery;

    return this.eventeRepository.find({
      skip: offset,
      take: limit,
    });
  }

  getOrganizerEvents(
    paginationQuery: PaginationQueryDto,
    { id }: User,
  ): Promise<Evente[]> {
    const { limit, offset } = paginationQuery;

    return this.eventeRepository.find({
      where: { user: { id } },
      skip: offset,
      take: limit,
    });
  }

  getEventByFilter(
    { title, status }: FilterEventDto, // paginationQuery: PaginationQueryDto,
  ) {
    // const { limit, offset } = paginationQuery;
    const events = this.eventeRepository.find({
      where: { status: status, title: title },
      // skip: offset,
      // take: limit,
    });
    return events;
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
    event.user = user;
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

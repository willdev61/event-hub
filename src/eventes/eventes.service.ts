import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return await this.eventeRepository.save(event, user);
  }

  // async getAllEvents(paginationQuery: PaginationQueryDto): Promise<Evente[]> {
  //   const { limit, offset } = paginationQuery;

  //   return this.eventeRepository.find({
  //     where: { isPublished: true },
  //     skip: offset,
  //     take: limit,
  //   });
  // }

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

  async getEventByFilter(
    { title, status, limit, offset }: FilterEventDto, // paginationQuery: PaginationQueryDto,
  ): Promise<Evente[]> {
    const events = await this.eventeRepository.find({
      where: { status, title, isPublished: true },
      skip: offset,
      take: limit,
    });
    return events;
  }

  async publishEvent(id: number) {
    const event = await this.eventeRepository.findOne({
      where: { id: id, isPublished: false },
    });
    if (event) {
      event.isPublished = true;
      return this.eventeRepository.save(event);
    }
    throw new BadRequestException(`L'évènement d'id ${id} a déja été publié.`);
  }

  async unPublishEvent(id: number) {
    const event = await this.eventeRepository.findOne({
      where: { id: id, isPublished: true },
    });
    if (event) {
      event.isPublished = false;
      return this.eventeRepository.save(event);
    }
    throw new BadRequestException(`L'évènement d'id ${id} a déja été publié.`);
  }

  getOrganizerEventsByAdmin(paginationQuery: PaginationQueryDto, id: number) {
    const { limit, offset } = paginationQuery;

    return this.eventeRepository
      .createQueryBuilder('evente')
      .where('evente.userId = :id', { id })
      .getMany();
  }

  async findOne(id: string) {
    const event = await this.eventeRepository.findOne({
      where: { id: +id },
    });
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return event;
  }

  async updateEvent(
    id: number,
    updateEventeDto: UpdateEventeDto,
    user: User,
  ): Promise<Evente> {
    const event = await this.eventeRepository.preload({
      id: +id,
      ...updateEventeDto,
    });
    if (!event) {
      throw new NotFoundException(`L'évenement d'id ${id} n'existe pas.`);
    }
    return this.eventeRepository.save(event);
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

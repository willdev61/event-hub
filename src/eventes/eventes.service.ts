import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventeDto } from './dto/create-evente.dto';
import { UpdateEventeDto } from './dto/update-evente.dto';
import { Evente } from './entities/evente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventesService {
  constructor(
    @InjectRepository(Evente)
    private readonly eventeRepository: Repository<Evente>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createEvent(createEventeDto: CreateEventeDto, user): Promise<Evente> {
    const tickets = await Promise.all(
      createEventeDto.tickets.map((price) => this.preloadTicketByPrice(price)),
    );
    const event = this.eventeRepository.create({ ...createEventeDto, tickets });
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
      relations: ['tickets'],
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
    const tickets =
      updateEventeDto.tickets &&
      (await Promise.all(
        updateEventeDto.tickets.map((price) =>
          this.preloadTicketByPrice(price),
        ),
      ));
    const event = await this.eventeRepository.preload({
      id: +id,
      ...updateEventeDto,
      tickets,
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

  private async preloadTicketByPrice(price: number): Promise<Ticket> {
    const existingTicket = await this.ticketRepository.findOne({
      where: { price: price },
    });
    if (existingTicket) {
      return existingTicket;
    }
    return this.ticketRepository.create({ price });
  }
}

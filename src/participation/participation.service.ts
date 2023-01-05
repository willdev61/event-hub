import { Injectable, ParseIntPipe } from '@nestjs/common';
import { Participation } from './entities/participation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { User } from 'src/users/entities/user.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async addNewParticipation(
    data: CreateParticipationDto,
    user: User,
  ): Promise<Participation> {
    const participation = this.participationRepository.create();
    participation.eventId = data.eventId;
    participation.userId = user.id;

    return await this.participationRepository.save(participation);
  }

  async getUserParticipations(
    user: User,
    paginationQuery: PaginationQueryDto,
  ): Promise<Participation[]> {
    const { limit, offset } = paginationQuery;
    return await this.participationRepository.find({
      where: { userId: user.id },
      relations: ['evente'],
      select: ['userId', 'eventId'],
      skip: offset,
      take: limit,
    });
  }

  async getEventParticipants(
    id: number,
    user: User,
    paginationQuery: PaginationQueryDto,
  ) {
    const { limit, offset } = paginationQuery;
    const participants = await this.participationRepository.find({
      where: { eventId: id },
      relations: ['user'],
      select: ['eventId'],
      skip: offset,
      take: limit,
    });
    if (!participants) {
      throw new NotFoundException(`L'évenement d'id ${id} n'existe pas.`);
    }
    return participants;
  }
}

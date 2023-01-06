import { Injectable, ParseIntPipe } from '@nestjs/common';
import { Participation } from './entities/participation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { User } from 'src/users/entities/user.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';

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
    const participations = await this.participationRepository.find({
      where: { userId: user.id },
      relations: ['evente'],
      select: ['eventId', 'id'],
      skip: offset,
      take: limit,
    });
    if (!participations) {
      throw new NotFoundException(`Vous n'avez pas d'évenements!!`);
    }
    return participations;
  }

  async getEventParticipants(
    id: number,
    user: User,
    paginationQuery: PaginationQueryDto,
  ): Promise<Participation[]> {
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

  async deleteParticipation(id: number) {
    const participation = await this.participationRepository.find({
      where: { id: id },
    });
    if (participation) {
      return this.participationRepository.remove(participation);
    }
  }
}

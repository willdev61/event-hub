import { Injectable, ParseIntPipe } from '@nestjs/common';
import { Participation } from './entities/participation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { User } from 'src/users/entities/user.entity';
import { Evente } from 'src/eventes/entities/evente.entity';

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

  async getUserParticipations(user: User): Promise<Participation[]> {
    return await this.participationRepository.find({
      where: { userId: user.id },
      relations: ['evente'],
      select: ['userId', 'eventId'],
    });
  }

  getEventParticipants(user: User) {
    return this.participationRepository.find({
      where: { eventId: user.id },
      relations: ['user'],
      select: ['userId', 'eventId'],
    });
  }
}

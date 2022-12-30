import { Injectable } from '@nestjs/common';
import { Participation } from './entities/participation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  addNewParticipation(
    data: CreateParticipationDto,
    user: User,
  ): Promise<Participation> {
    const participation = this.participationRepository.create();
    participation.eventId = data.eventId;
    participation.userId = user.id;

    return this.participationRepository.save(participation);
  }

  getUserParticipations(user: User): Promise<Participation[]> {
    return this.participationRepository.find({
      where: { userId: user.id },
      relations: ['evente', 'user'],
    });
  }
}

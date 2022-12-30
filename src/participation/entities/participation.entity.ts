import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Evente } from '../../eventes/entities/evente.entity';
import { TimestampEntities } from 'src/generics/timestamp.entities';

@Entity()
export class Participation extends TimestampEntities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  eventId: number;

  @ManyToOne((type) => User, (user) => user.participations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Evente, (evente) => evente.participations)
  @JoinColumn({ name: 'eventId' })
  evente: Evente;
}

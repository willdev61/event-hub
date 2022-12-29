import { Module } from '@nestjs/common';
import { EventesService } from './eventes.service';
import { EventesController } from './eventes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evente } from './entities/evente.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evente, User])],
  controllers: [EventesController],
  providers: [EventesService],
})
export class EventesModule {}

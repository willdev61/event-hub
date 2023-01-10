import { Module } from '@nestjs/common';
import { EventesService } from './eventes.service';
import { EventesController } from './eventes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evente } from './entities/evente.entity';
import { User } from 'src/users/entities/user.entity';
import { Participation } from 'src/participation/entities/participation.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Evente])],
  controllers: [EventesController],
  providers: [EventesService],
})
export class EventesModule {}

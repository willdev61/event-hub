import { Module } from '@nestjs/common';
import { EventesService } from './eventes.service';
import { EventesController } from './eventes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evente } from './entities/evente.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Evente])],
  controllers: [EventesController],
  providers: [EventesService],
})
export class EventesModule {}

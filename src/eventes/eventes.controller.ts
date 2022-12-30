import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventesService } from './eventes.service';
import { CreateEventeDto } from './dto/create-evente.dto';
import { UpdateEventeDto } from './dto/update-evente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Evente } from './entities/evente.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Controller('events')
export class EventesController {
  constructor(private readonly eventesService: EventesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEvent(@Body() createEventeDto: CreateEventeDto, @User() user) {
    return await this.eventesService.createEvent(createEventeDto, user);
  }

  @Get()
  async getAllEvents(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Evente[]> {
    return await this.eventesService.getAllEvents(paginationQuery);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getEventByUser() {
    return await this.eventesService.getEventUser();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneEvent(@Param('id') id: string): Promise<Evente> {
    return await this.eventesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventeDto: UpdateEventeDto,
    @User() user,
  ): Promise<Evente> {
    return await this.eventesService.updateEvent(+id, updateEventeDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeEvent(@Param('id') id: string) {
    return await this.eventesService.removeEvent(id);
  }

  @Delete('desactivate/:id')
  @UseGuards(JwtAuthGuard)
  async desactivateEvent(@Param('id') id: string) {
    return await this.eventesService.softDeleteEvent(id);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async recoverEvent(@Param('id') id: string) {
    return await this.eventesService.restoreEvent(id);
  }
}

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
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../auth/decorators';
import { Evente } from './entities/evente.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { UserRole } from '../enums/role.enum';
import { User } from 'src/users/entities/user.entity';
import { FilterEventDto } from './dto/filter-event.dto';

@Controller('events')
export class EventesController {
  constructor(private readonly eventesService: EventesService) {}

  @Post('create-events')
  @Roles(UserRole.Organizer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createEvent(
    @Body() createEventeDto: CreateEventeDto,
    @CurrentUser() user: User,
  ) {
    return await this.eventesService.createEvent(createEventeDto, user);
  }

  @Get('get-all-events')
  async getAllEvents(@Query() filterDto: FilterEventDto): Promise<Evente[]> {
    return this.eventesService.getEventByFilter(filterDto);
  }

  @Get('get-organizer-events')
  @Roles(UserRole.Organizer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOrganizerEvents(
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() user: User,
  ): Promise<Evente[]> {
    return await this.eventesService.getOrganizerEvents(paginationQuery, user);
  }

  @Get('get-desactivate-event')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDesactivateEvents(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Evente[]> {
    return await this.eventesService.getDesactivateEvents(paginationQuery);
  }

  @Post('publish-event/:id')
  @Roles(UserRole.Organizer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async publishEvent(@Param('id') id: string) {
    return this.eventesService.publishEvent(+id);
  }

  @Post('unpublish-event/:id')
  @Roles(UserRole.Organizer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async unPublishEvent(@Param('id') id: string) {
    return this.eventesService.unPublishEvent(+id);
  }

  @Get('get-event-by-admin/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOrganizerEventsByAdmin(
    @Query() paginationQuery: PaginationQueryDto,
    @Param('id') id: string,
  ) {
    return this.eventesService.getOrganizerEventsByAdmin(paginationQuery, +id);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthGuard)
  async findOneEvent(@Param('id') id: string): Promise<Evente> {
    return await this.eventesService.findOne(id);
  }

  @Patch('update-event/:id')
  @Roles(UserRole.Organizer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventeDto: UpdateEventeDto,
    @CurrentUser() user,
  ): Promise<Evente> {
    return await this.eventesService.updateEvent(+id, updateEventeDto, user);
  }

  @Delete('delete-event/:id')
  @Roles(UserRole.Organizer, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  async removeEvent(@Param('id') id: string) {
    return await this.eventesService.removeEvent(id);
  }

  @Delete('desactivate-event/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  async desactivateEvent(@Param('id') id: string) {
    return await this.eventesService.softDeleteEvent(id);
  }

  @Get('restore-evente/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async recoverEvent(@Param('id') id: string) {
    return await this.eventesService.restoreEvent(id);
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { CurrentUser, Roles } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { UserRole } from 'src/enums/role.enum';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('/add-new-participation')
  @UseGuards(JwtAuthGuard)
  addNewParticipation(
    @Body() data: CreateParticipationDto,
    @CurrentUser() user: User,
  ) {
    return this.participationService.addNewParticipation(data, user);
  }

  @Get('/get-user-participations')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getUserParticipations(
    @CurrentUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.participationService.getUserParticipations(
      user,
      paginationQuery,
    );
  }

  @Post('/get-event-participants')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRole.Organizer, UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getEventParticipants(
    @CurrentUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.participationService.getEventParticipants(
      user,
      paginationQuery,
    );
  }
}

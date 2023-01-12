import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Param,
} from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { CurrentUser, Roles } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { UserRole } from 'src/enums/role.enum';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { Participation } from './entities/participation.entity';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('/add-new-participation')
  @Roles(UserRole.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addNewParticipation(
    @Body() data: CreateParticipationDto,
    @CurrentUser() user: User,
  ): Promise<Participation> {
    return await this.participationService.addNewParticipation(data, user);
  }

  @Get('/get-user-participations')
  @Roles(UserRole.User)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserParticipations(
    @CurrentUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Participation[]> {
    return await this.participationService.getUserParticipations(
      user,
      paginationQuery,
    );
  }

  @Get('/get-event-participants/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRole.Organizer, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getEventParticipants(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Participation[]> {
    return await this.participationService.getEventParticipants(
      +id,
      user,
      paginationQuery,
    );
  }

  @Post('/cancel-participation/:id')
  @Roles(UserRole.User, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard)
  async cancelParticipation(@Param('id') id: string) {
    return await this.participationService.deleteParticipation(+id);
  }
}

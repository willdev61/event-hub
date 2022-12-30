import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { CurrentUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards';
import { get } from 'http';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  addNewParticipation(
    @Body() data: CreateParticipationDto,
    @CurrentUser() user: User,
  ) {
    return this.participationService.addNewParticipation(data, user);
  }

  @Get('get-user-participations')
  @UseGuards(JwtAuthGuard)
  getUserParticipations(@CurrentUser() user: User) {
    return this.participationService.getUserParticipations(user);
  }
}

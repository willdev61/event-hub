import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.postSignup(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return await this.usersService.getAllUsers(paginationQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOneUser(@Param('id') id: string) {
    return await this.usersService.getOneUser(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeEvent(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }

  @Delete('desactivate/:id')
  @UseGuards(JwtAuthGuard)
  async desactivateEvent(@Param('id') id: string) {
    return await this.usersService.softDeleteUser(id);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async recoverEvent(@Param('id') id: string) {
    return await this.usersService.restoreUser(id);
  }
}

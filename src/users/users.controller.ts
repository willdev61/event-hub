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
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { UserRole } from 'src/enums/role.enum';
import { CurrentUser, Roles } from 'src/auth/decorators';
import { RolesGuard } from 'src/auth/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/get-all-users')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(@Query() paginationQuery: PaginationQueryDto) {
    return await this.usersService.getAllUsers(paginationQuery);
  }

  @Patch('update-user-info')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(user, updateUserDto);
  }

  @Get('get-one-user/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOneUser(@Param('id') id: string) {
    return await this.usersService.getOneUser(id);
  }

  @Delete('delete-user/:id')
  @UseGuards(JwtAuthGuard)
  async removeUserAccount(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }

  @Get('desactivate-user/:id')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async desactivateUserAccount(@Param('id') id: string) {
    return await this.usersService.softDeleteUser(id);
  }

  @Get('restore-user/:id')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async recoverUserAccount(@Param('id') id: string) {
    return await this.usersService.restoreUser(id);
  }
}

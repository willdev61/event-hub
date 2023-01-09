import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createSuperAdmin() {
    const user = await this.userRepository.findOne({
      where: { email: 'admin@eventhub.com' },
    });
    if (!user) {
      await this.authService.postSignup({
        username: 'SuperAdmin',
        email: 'admin@eventhub.com',
        contacts: '1235667009',
        password: 'azertyuiop',
        role: UserRole.SuperAdmin,
      });
    }
  }
  async getAllUsers(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async getOneUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });
    if (!user) {
      throw new NotFoundException(`L'utilisateur d'id ${id} non existant`);
    }
    return user;
  }

  async updateUser({ id }: User, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
        password: hash,
      });
      if (!newUser) {
        throw new NotFoundException(`L'utilisateur d'id ${id} non existant`);
      }
      return this.userRepository.save(newUser);
    }
    if (!password) {
      const newUser = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
      });
      if (!newUser) {
        throw new NotFoundException(`L'utilisateur d'id ${id} non existant`);
      }
      return this.userRepository.save(newUser);
    }
  }
  async removeUser(id: string) {
    const event = await this.getOneUser(id);
    return this.userRepository.remove(event);
  }

  async softDeleteUser(id: string) {
    return await this.userRepository.softDelete(id);
  }

  async restoreUser(id: string) {
    return this.userRepository.restore(id);
  }
}

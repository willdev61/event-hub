import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`L'utilisateur d'id ${id} non existant`);
    }
    return this.userRepository.save(user);
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

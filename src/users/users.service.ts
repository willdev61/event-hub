import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { UserRole } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSuperAdmin() {
    const user = await this.userRepository.findOne({
      where: { email: 'admin@eventhub.com' },
    });
    if (!user) {
      await this.createUser({
        username: 'SuperAdmin',
        email: 'admin@eventhub.com',
        contacts: '1235667009',
        password: 'azertyuiop',
        role: UserRole.SuperAdmin,
      });
    }
  }

  createUserAccount(userData: CreateUserDto) {
    return this.createUser({ ...userData, role: UserRole.User });
  }

  createOrganizerAccount(organizerData: CreateUserDto) {
    return this.createUser({ ...organizerData, role: UserRole.Organizer });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const { password } = userData;
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hash,
    });

    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(`Cet Utilisateur existe déja!!!`);
    }
  }

  async getAllUsers(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.userRepository.find({
      skip: offset,
      take: limit,
      withDeleted: true,
    });
  }
  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'email ${email} non existant`,
      );
    } else {
      try {
        user.deletedAt !== null;
      } catch (error) {
        throw new NotFoundException(
          ` ${email} Vous avez été bloqué par l'Administrateur`,
        );
      }
    }

    return user;
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

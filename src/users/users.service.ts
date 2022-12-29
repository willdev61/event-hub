import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import {
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async postSignup(userData: SignupDto): Promise<User | String> {
    const { password } = userData;
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ ...userData, password: hash });
    try {
      this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async postLogin(userData: LoginDto) {
    const { username, password } = userData;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) throw new NotFoundException('User non existant');
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const jwt = this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } else throw new UnauthorizedException('Mot de passe invalide');
  }
}

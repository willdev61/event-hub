import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UserRole } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  createUserAccount(userData: SignupDto) {
    return this.postSignup({ ...userData, role: UserRole.User });
  }

  createOrganizerAccount(organizerData: SignupDto) {
    return this.postSignup({ ...organizerData, role: UserRole.Organizer });
  }

  async postSignup(userData: SignupDto): Promise<User> {
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

  async postLogin(userData: LoginDto) {
    const { email, password } = userData;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new NotFoundException('Utilisateur non existant');
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
        username: user.username,
        email: user.email,
      };
    } else throw new UnauthorizedException('Mot de passe invalide');
  }
}

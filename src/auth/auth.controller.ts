import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/register')
  signUp(@Body() user: SignupDto): Promise<User | String> {
    return this.authService.postSignup(user);
  }

  @Post('/connexion')
  login(@Body() user: LoginDto) {
    return this.authService.postLogin(user);
  }
}

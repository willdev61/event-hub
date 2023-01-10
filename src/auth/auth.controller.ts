import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/register')
  userSignUp(@Body() user: SignupDto): Promise<User> {
    return this.userService.createUserAccount(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/organizer/register')
  organizerSignUp(@Body() user: SignupDto): Promise<User> {
    return this.userService.createOrganizerAccount(user);
  }

  @Post('/connexion')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() user: LoginDto) {
    return this.authService.postLogin(user);
  }
}

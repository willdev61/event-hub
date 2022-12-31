import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Length(8, 30)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @Length(8, 30)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

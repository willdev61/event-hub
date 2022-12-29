import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from 'src/enums/role.enum';

export class SignupDto {
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Length(8, 30)
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @Length(2, 10)
  @IsNotEmpty()
  @IsNumber()
  readonly contacts: number;

  @IsEnum(UserRole)
  @IsOptional()
  readonly role: string;
}

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

export class CreateUserDto {
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

  // @Length(2, 10)
  @IsNotEmpty()
  @IsString()
  readonly contacts: string;

  @IsEnum(UserRole)
  @IsOptional()
  readonly role: UserRole;
}

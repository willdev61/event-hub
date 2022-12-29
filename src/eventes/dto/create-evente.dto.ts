import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateEventeDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsString()
  readonly date: string;

  @IsNotEmpty()
  @IsNumber()
  readonly nbPlace: number;

  @IsBoolean()
  readonly status: boolean;
}

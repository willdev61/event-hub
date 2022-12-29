import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateEventeDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @IsString()
  readonly date: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly nbPlace: number;

  @IsBoolean()
  readonly status: boolean;
}

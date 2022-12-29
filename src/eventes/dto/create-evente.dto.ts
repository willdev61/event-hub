import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Ticket } from '../entities/ticket.entity';

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

  @IsArray()
  readonly tickets: number[];
}

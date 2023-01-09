import { IsBoolean } from 'class-validator';

export class FilterEventDto {
  @IsBoolean()
  status: boolean;
}

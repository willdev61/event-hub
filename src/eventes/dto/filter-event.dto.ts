import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterEventDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}

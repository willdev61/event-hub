import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { Transform, Type } from 'class-transformer';

export class FilterEventDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return ['true', true, '1', 1].indexOf(value) > -1;
  })
  status?: boolean;
}

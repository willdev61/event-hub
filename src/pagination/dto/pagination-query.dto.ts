import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Min(0)
  offset?: number;
}

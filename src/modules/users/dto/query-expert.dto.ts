import { IsOptional, IsString } from 'class-validator';
import { IPaginateOptions } from 'src/utils/paginate';

export class QueryExpertDto extends IPaginateOptions {
  @IsOptional()
  @IsString()
  search_term: string;
}

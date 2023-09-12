import { IsOptional, IsString } from 'class-validator';
import { IPaginateOptions } from 'src/utils/paginate';

export class QueryUserDto extends IPaginateOptions {
  @IsOptional()
  @IsString()
  search_term: string;
}

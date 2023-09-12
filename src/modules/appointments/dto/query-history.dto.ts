import { IsNotEmpty, IsString } from 'class-validator';
import { IPaginateOptions } from 'src/utils/paginate';

export class QueryHistoryDto extends IPaginateOptions {
  @IsNotEmpty()
  @IsString()
  refUid: string;
}

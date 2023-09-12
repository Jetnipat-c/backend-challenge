import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class IPaginateOptions {
  @IsOptional()
  @Transform((page) => Number(page.value))
  @IsNumber()
  @Min(1)
  readonly page: number = 1;

  @IsOptional()
  @Transform((limit) => Number(limit.value))
  @IsNumber()
  @Min(1)
  readonly limit: number = 10;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export interface IPaginationMeta<T> {
  items: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginateOptions,
): Promise<IPaginationMeta<T>> {
  const take = options.limit;
  const skip = (options.page - 1) * options.limit;

  queryBuilder.skip(skip).take(take);
  const [list, totalItems] = await queryBuilder.getManyAndCount();

  return {
    items: list,
    meta: {
      itemCount: list.length,
      totalItems: totalItems,
      itemsPerPage: options.limit,
      totalPages: Math.ceil(totalItems / options.limit),
      currentPage: options.page,
    },
  };
}

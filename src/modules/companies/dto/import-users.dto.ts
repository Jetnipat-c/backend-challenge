import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/database';

export class ImportUsersDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  users: Users[];
}

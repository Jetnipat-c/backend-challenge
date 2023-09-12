import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AliasRole } from 'src/database';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(AliasRole)
  role: AliasRole;

  @IsOptional()
  companyId: string;
}

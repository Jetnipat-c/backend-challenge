import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;
}

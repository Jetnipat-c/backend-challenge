import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateExpertDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}

import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  address: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  email: string;

  @IsOptional()
  website: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @Min(0)
  quota: number;
}

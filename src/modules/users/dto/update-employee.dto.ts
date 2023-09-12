import { IsNotEmpty } from 'class-validator';

export class UpdateEmployeeDto {
  @IsNotEmpty()
  name: string;
}

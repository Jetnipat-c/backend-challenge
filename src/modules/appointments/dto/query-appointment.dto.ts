import { IsNotEmpty, IsString } from 'class-validator';
import { IPaginateOptions } from 'src/utils/paginate';

export class QueryExpertAppointmentDto extends IPaginateOptions {
  @IsNotEmpty()
  @IsString()
  expertId: string;

  @IsNotEmpty()
  @IsString()
  appointmentDate: string;
}

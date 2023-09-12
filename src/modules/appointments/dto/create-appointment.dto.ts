import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  refUid: string;

  @IsNotEmpty()
  @IsUUID(4)
  expertId: string;

  @IsNotEmpty()
  @IsString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}

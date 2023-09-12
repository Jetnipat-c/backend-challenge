import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { QueryExpertAppointmentDto } from './dto/query-appointment.dto';
import { QueryHistoryDto } from './dto/query-history.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  // check expert is available
  @Get()
  searchForAppointments(
    @Query() queryExpertAppointmentDto: QueryExpertAppointmentDto,
  ) {
    return this.appointmentsService.searchForAppointments(
      queryExpertAppointmentDto,
    );
  }

  @Get('history')
  getAppointmentByUserUid(@Query() queryHistoryDto: QueryHistoryDto) {
    return this.appointmentsService.getAppointmentByUserUid(queryHistoryDto);
  }
}

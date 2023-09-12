import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AliasRole, Appointments, Companies, Users } from 'src/database';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { QueryExpertAppointmentDto } from './dto/query-appointment.dto';
import { IPaginationMeta, paginate } from 'src/utils/paginate';
import { QueryHistoryDto } from './dto/query-history.dto';

dayjs.extend(isSameOrAfter);

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private readonly appointmentsRepo: Repository<Appointments>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Companies)
    private readonly companiesRepo: Repository<Companies>,
    private dataSource: DataSource,
  ) {}
  async createAppointment(createAppointmentDto: CreateAppointmentDto) {
    // Find the expert user
    const expertUser = await this.usersRepo.findOne({
      where: { id: createAppointmentDto.expertId, role: AliasRole.EXPERT },
    });

    if (!expertUser) {
      throw new BadRequestException('Expert not found');
    }

    // Find the employee user and its company
    const employeeUser = await this.usersRepo.findOne({
      where: {
        refUid: createAppointmentDto.refUid,
        role: AliasRole.EMPLOYEE,
      },
      relations: ['company'],
    });

    if (!employeeUser) {
      throw new BadRequestException('Employee not found');
    }

    if (!employeeUser.company) {
      throw new BadRequestException('Employee has no company');
    }

    // Check if the company has quota
    if (employeeUser.company.quota <= 0) {
      throw new BadRequestException('Quota exceeded');
    }

    // validate time
    const startTime = dayjs(createAppointmentDto.startTime, {
      format: 'HH:mm:ss',
    });
    const endTime = dayjs(createAppointmentDto.endTime, {
      format: 'HH:mm:ss',
    });

    if (
      startTime.isAfter(endTime) ||
      startTime.isSame(endTime) ||
      !startTime.isSameOrAfter(dayjs())
    ) {
      throw new BadRequestException('Invalid time');
    }

    const minutesDiff = endTime.diff(startTime, 'minute');

    if (minutesDiff !== 60) {
      throw new BadRequestException('The time difference is not 1 hour.');
    }

    // Check if the expert has appointment at the same time
    const appointmentAlreadyExists = await this.appointmentsRepo.findOne({
      where: {
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        startTime: new Date(createAppointmentDto.startTime),
        endTime: new Date(createAppointmentDto.endTime),
        refUid: createAppointmentDto.refUid,
      },
    });

    if (appointmentAlreadyExists) {
      throw new BadRequestException('Appointment already exists');
    }

    // Create appointment
    const appointment = this.appointmentsRepo.create({
      ...createAppointmentDto,
      refUid: employeeUser.refUid,
      employeeName: employeeUser.name,
      expertId: expertUser.id,
      expertName: expertUser.name,
      companyId: employeeUser.company.id,
      companyName: employeeUser.company.name,
    });

    try {
      await this.dataSource.manager.transaction(async (transactionEntity) => {
        await transactionEntity
          .createQueryBuilder()
          .insert()
          .into(Appointments)
          .values(appointment)
          .execute();
        await transactionEntity
          .createQueryBuilder()
          .update(Companies)
          .set({ quota: () => 'quota - 1' })
          .where('id = :id', { id: employeeUser.company.id })
          .execute();
      });

      const appointmentRes = await this.appointmentsRepo.findOne({
        where: { id: appointment.id },
      });
      return appointmentRes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchForAppointments(
    queryExpertAppointmentDto: QueryExpertAppointmentDto,
  ) {
    const appointmentBuilder =
      this.appointmentsRepo.createQueryBuilder('appointment');

    appointmentBuilder.where('appointment.expertId = :expertId', {
      expertId: queryExpertAppointmentDto.expertId,
    });
    appointmentBuilder.andWhere(
      'appointment.appointmentDate = :appointmentDate',
      {
        appointmentDate: new Date(queryExpertAppointmentDto.appointmentDate),
      },
    );

    return await paginate<Appointments>(
      appointmentBuilder,
      queryExpertAppointmentDto,
    );
  }

  async getAppointmentByUserUid(
    queryHistoryDto: QueryHistoryDto,
  ): Promise<IPaginationMeta<Appointments>> {
    const appointmentBuilder =
      this.appointmentsRepo.createQueryBuilder('appointment');
    appointmentBuilder.where('appointment.refUid = :refUid', {
      refUid: queryHistoryDto.refUid,
    });
    appointmentBuilder.orderBy('appointment.appointmentDate', 'ASC');
    appointmentBuilder.addOrderBy('appointment.startTime', 'ASC');
    return await paginate<Appointments>(appointmentBuilder, queryHistoryDto);
  }
}

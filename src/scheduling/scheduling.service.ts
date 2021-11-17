import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { endOfDay, format, isBefore, isEqual, isValid, parseISO, startOfDay, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateScheduling, TFilterScheduling } from './scheduling.dto';
import { Scheduling } from './scheduling.model';
import { MailService } from '../mail/mail.service';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectModel(Scheduling)
    private readonly schedulingModel: typeof Scheduling,
    private schedulingTypesService: SchedulingTypesService,
    private mailService: MailService,
    private sequelize: Sequelize,
    private userService: UserService
  ) { }

  async all() {
    return await this.schedulingModel.findAll()
  }
  
  async get(query?: TFilterScheduling) {
    trimObj(query);
    const where = {};

    if (query.schedulingTypesId) Object.assign(where, { schedulingTypesId: query.schedulingTypesId });
    if (query.date) Object.assign(where, { date: query.date });
    if (convertBool(query.canceled)) Object.assign(where, { canceledAt: { [$.not]: null } });

    return await this.schedulingModel.findAll({ where });
  }

  async mySchedules(userId: number, query?: TFilterScheduling) {
    trimObj(query);
    const where = { userId };

    if (query.schedulingTypesId) Object.assign(where, { schedulingTypesId: query.schedulingTypesId });
    if (query.date) Object.assign(where, { date: query.date });

    return await this.schedulingModel.findAll({ where });
  }

  async findById(id: number, userId?: number) {
    const where = { id };

    if (userId) Object.assign(where, { userId });

    const scheduling = await this.schedulingModel.findOne({ where });

    if (!scheduling) throw new HttpException('Agendamento não encontrado', 404);

    return scheduling;
  }

  async availableSchedulings(schedulingTypesId: number, date: string) {
    const schedule = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    await this.schedulingTypesService.getById(schedulingTypesId);

    const searchDate = parseISO(date);
    const today = startOfToday();

    switch (true) {
      case !date:
        throw new HttpException('Data é obrigatória', 400);
      case !isValid(searchDate):
        throw new HttpException('Data inválida', 400);
      case isBefore(searchDate, today):
        throw new HttpException('Impossível agendar em uma data passada', 400);
      default:
        break;
    }

    const schedulings = await this.schedulingModel.findAll({
      where: {
        schedulingTypesId,
        canceledAt: null,
        date
      }
    });

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':').map(Number);

      const limit = `${String(hour - 1).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const tmp = new Date().getUTCHours() - 3;
      const value = `${date}T${String(hour).padStart(2, '0')}`;

      const equal = isEqual(searchDate, today);

      if (!equal) {
        return {
          time,
          limit,
          value,
          available: !schedulings.find(sch => sch.date === date && sch.hour === time)
        };
      }

      return {
        time,
        limit,
        value,
        available: (hour - 1) > tmp && !schedulings.find(sch => sch.date === date && sch.hour === time),
      };
    });

    return available;
  }

  async post(user: User, data: TCreateScheduling) {
    trimObj(data);

    if ((await this.userService.userWithPet(user.id)).pets.length === 0) throw new HttpException('Você não adotou um pet para efetuar um agendamento', 400);

    const schedulingType = await this.schedulingTypesService.getById(data.schedulingTypesId);

    const [date, time] = data.date.split('T');
    const tmp = new Date().getUTCHours() - 3;
    const dateParsed = parseISO(date);

    if (!isValid(dateParsed)) throw new HttpException('Data inválida', 400);
    if (isBefore(dateParsed, startOfToday())) throw new HttpException('Data passada não permitida', 400);

    if (isEqual(dateParsed, startOfToday())) {
      if (Number(time) <= tmp) throw new HttpException('Hora passada não permitida', 400);
    }

    const hour = `${time}:00`;

    const available = await this.schedulingModel.findOne({
      where: {
        schedulingTypesId: data.schedulingTypesId,
        date,
        hour,
        canceledAt: null
      }
    });

    if (available || (Number(time) < 9 || Number(time) > 17)) throw new HttpException('Data de agendamento indisponível', 400);

    const dateFormatted = `${format(parseISO(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, as ${hour}`;

    const transaction = await this.sequelize.transaction();

    try {
      await this.schedulingModel.create({
        ...data,
        date,
        hour,
        userId: user.id
      }, { transaction });

      await transaction.commit();

      await this.mailService.newScheduling(user, dateFormatted, schedulingType.name);

      return { message: 'Agendamento marcado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async cancelSchedule(user: User, id: number) {
    const scheduling = await this.schedulingModel.findOne({
      where: {
        id,
        userId: user.id
      }
    });

    if (!scheduling) throw new HttpException('Agendamento não encontrado', 404);
    if (scheduling.canceledAt) throw new HttpException('Agendamento já foi cancelado', 400);

    if (isBefore(parseISO(scheduling.date), startOfToday())) throw new HttpException('Agendamento ocorrido não pode ser cancelado', 400);

    const tmp = new Date().getUTCHours() - 3;
    const [time,] = scheduling.hour.split(":").map(Number);

    if (isEqual(parseISO(scheduling.date), startOfToday())) {
      if (time - 1 <= tmp) throw new HttpException('Você só pode cancelar um agendamento com uma hora de antecedência', 400);
    }

    const dateFormatted = `${format(parseISO(scheduling.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, as ${scheduling.hour}`;

    const transaction = await this.sequelize.transaction();

    try {
      await scheduling.update({ canceledAt: new Date() }, { transaction });

      await transaction.commit();

      await this.mailService.cancelScheduling(user, dateFormatted, scheduling.schedulingTypes.name);

      return { message: 'Agendamento cancelado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}
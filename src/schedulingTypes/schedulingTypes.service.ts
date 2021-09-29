import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SchedulingTypes } from './schedulingTypes.model';

@Injectable()
export class SchedulingTypesService {
  constructor(
    @InjectModel(SchedulingTypes)
    private readonly schedulingTypesModel: typeof SchedulingTypes
  ) { }

  async get(name?: string) {
    if (name) return await this.getByName(name);

    return await this.schedulingTypesModel.findAll();
  }

  async getById(id: number) {
    const schedulingTypes = await this.schedulingTypesModel.findByPk(id);

    if (!schedulingTypes) throw new HttpException("Tipo de agendamento não encontrado", 404);

    return schedulingTypes;
  }

  async getByName(name: string) {
    return await this.schedulingTypesModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }
}

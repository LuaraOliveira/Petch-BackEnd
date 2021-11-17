import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SchedulingTypes } from './schedulingTypes.model';
import { capitalizeFirstLetter } from '../utils';

@Injectable()
export class SchedulingTypesService {
  constructor(
    @InjectModel(SchedulingTypes)
    private readonly schedulingTypesModel: typeof SchedulingTypes
  ) { }

  async createSchedulingTypes() {
    await this.schedulingTypesModel.bulkCreate([
      { id: 1, name: "Vacina" },
      { id: 2, name: "Banho" },
      { id: 3, name: "Medicação" },
    ])
  }

  async dash() {
    return await this.schedulingTypesModel.scope('dash').findAll();
  }

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
        name: capitalizeFirstLetter(name).normalize().trim()
      }
    });
  }
}

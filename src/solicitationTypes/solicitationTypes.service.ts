import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SolicitationTypes } from './solicitationTypes.model';

@Injectable()
export class SolicitationTypesService {
  constructor(
    @InjectModel(SolicitationTypes)
    private readonly solicitationTypesModel: typeof SolicitationTypes
  ) { }

  async get(name?: string) {
    if (name) return await this.findByName(name);

    return await this.solicitationTypesModel.findAll();
  }

  async findById(id: number) {
    const solicitationTypes = await this.solicitationTypesModel.findByPk(id);

    if (!solicitationTypes) throw new HttpException("Tipo de solicitação não encontrada", 404);

    return solicitationTypes;
  }

  async findByName(name: string) {
    return await this.solicitationTypesModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateSolicitation } from './solicitation.dto';
import { Solicitation } from './solicitation.model';
import { SolicitationTypesService } from '../solicitationTypes/solicitationTypes.service';
import { User } from '../user/user.model';
import { trimObj } from '../utils';

@Injectable()
export class SolicitationService {
  constructor(
    @InjectModel(Solicitation)
    private readonly solicitationModel: typeof Solicitation,
    private solicitationTypeService: SolicitationTypesService,
    private sequelize: Sequelize
  ) { }

  async get() {
    return await this.solicitationModel.findAll();
  }

  async findById(id: number) {
    const solicitation = await this.solicitationModel.findByPk(id);

    if (!solicitation) throw new HttpException('Solicitação não encontrada', 404);

    return solicitation;
  }

  async post(data: TCreateSolicitation, user?: User) {
    trimObj(data);

    await this.solicitationTypeService.findById(data.solicitationTypesId);

    const transaction = await this.sequelize.transaction();

    try {
      await this.solicitationModel.create({
        ...data,
        userId: user.id
      }, { transaction });

      await transaction.commit();

      return { message: 'Solicitação enviada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async delete(id: number) {
    const solicitation = await this.findById(id);

    await solicitation.destroy();
  }
}
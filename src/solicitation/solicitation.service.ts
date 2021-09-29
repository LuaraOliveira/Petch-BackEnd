import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateSolicitation } from './solicitation.dto';
import { Solicitation } from './solicitation.model';
import { UploadService } from '../config/upload.service';
import { SolicitationTypesService } from '../solicitationTypes/solicitationTypes.service';
import { User } from '../user/user.model';
import { trimObj } from '../utils';

@Injectable()
export class SolicitationService {
  constructor(
    @InjectModel(Solicitation)
    private readonly solicitationModel: typeof Solicitation,
    private solicitationTypeService: SolicitationTypesService,
    private uploadService: UploadService,
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

  async post(data: TCreateSolicitation, media?: Express.MulterS3.File, user?: User) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      await this.solicitationTypeService.findById(data.solicitationTypeId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      if (user) {
        data.name = null;
        data.email = null;

        const solicitation = await this.solicitationModel.create({
          ...data,
          userId: user.id
        }, { transaction });

        await transaction.commit();

        return solicitation;
      }

      if (!data.email) throw new HttpException('E-mail é obrigatório', 400);
      if (!data.name) throw new HttpException('Nome é obrigatório', 400);

      const solicitation = await this.solicitationModel.create({ ...data }, { transaction });

      await transaction.commit();

      return solicitation;
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
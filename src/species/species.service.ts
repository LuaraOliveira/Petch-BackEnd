import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateSpecies, TFilterSpecies, TUpdateSpecies } from './species.dto';
import { Species } from './species.model';
import { UploadService } from '../config/upload.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectModel(Species)
    private readonly speciesModel: typeof Species,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterSpecies) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, {
      name: {
        [$.startsWith]: query.name.normalize().toLowerCase()
      }
    });

    return await this.speciesModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const species = await this.speciesModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!species) throw new HttpException('Espécie não encontrada', 404);

    return species;
  }

  async findByName(name: string) {
    return await this.speciesModel.findOne({
      where: {
        name: name.normalize().trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const species = await this.speciesModel.create({ ...data }, { transaction });

      await transaction.commit();

      return species;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateSpecies, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const species = await this.findById(id);

      if (await this.findByName(data.name)) throw new HttpException('Espécie já cadastrada', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await species.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const specie = await this.findById(id, 'true');

    if (!st) return await specie.destroy();
    return await specie.restore();
  }
}

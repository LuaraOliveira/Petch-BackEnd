import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TFilterOng, TCreateOng, TUpdateOng } from './ong.dto';
import { Ong } from './ong.model';
import { UploadService } from '../config/upload.service';
import { capitalizeFirstLetter, convertBool, trimObj } from '../utils';

@Injectable()
export class OngService {
  constructor(
    @InjectModel(Ong)
    private readonly ongModel: typeof Ong,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async all() {
    return await this.ongModel.findAll();
  }

  async petsByOng() {
    return await this.ongModel.scope('petsByOng').findAll();
  }

  async get(query?: TFilterOng) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    return await this.ongModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'email', 'phone1', 'responsible', 'image', 'cep', 'city', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const ong = await this.ongModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!ong) throw new HttpException('ONG não encontrada', 404);

    return ong;
  }

  async findByName(name: string) {
    return await this.ongModel.findOne({
      where: {
        name: capitalizeFirstLetter(name).trim()
      }
    });
  }

  async findByEmail(email: string) {
    return await this.ongModel.findOne({
      where: {
        email: email.toLowerCase()
      }
    });
  }

  async post(data: TCreateOng, media?: Express.MulterS3.File) {
    trimObj(data);

    if (await this.findByEmail(data.email) || await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    if (capitalizeFirstLetter(data.coverage) === 'Nacional') data.coverage = 'AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO';

    const transaction = await this.sequelize.transaction();

    try {
      await this.ongModel.create({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'ONG cadastrada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateOng, media?: Express.MulterS3.File) {
    trimObj(data);

    const ong = await this.findById(id);

    if (data.email && data.email !== ong.email) {
      if (await this.findByEmail(data.email)) throw new HttpException('ONG já cadastrada', 400);
    }

    if (data.name && data.name !== ong.name) {
      if (await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);
    }

    if (media) {
      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });
    }

    if (data.coverage && capitalizeFirstLetter(data.coverage) === 'Nacional') data.coverage = 'AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO';

    const transaction = await this.sequelize.transaction();

    try {
      await ong.update({ ...data }, { transaction });

      await transaction.commit();

      return { message: 'ONG editada com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const ong = await this.ongModel.findOne({
      where: { id },
      paranoid: false,
      include: { all: true, paranoid: false }
    });

    if (!ong) throw new HttpException('ONG não encontrada', 404);

    if (!st) {
      await ong.destroy();
      return ong.pets.map(pet => pet.destroy());
    }

    await ong.restore();
    return ong.pets.map(pet => pet.restore());
  }
}
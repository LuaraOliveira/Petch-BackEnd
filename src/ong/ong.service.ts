import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TFilterOng, TCreateOng, TUpdateOng } from './ong.dto';
import { Ong } from './ong.model';
import { UploadService } from '../config/upload.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class OngService {
  constructor(
    @InjectModel(Ong)
    private readonly ongModel: typeof Ong,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterOng) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    // if (query.coverage) {
    //   const ongs = await this.ongModel.findAll({
    //     paranoid: !convertBool(query.inactives),
    //     where,
    //     attributes: ['id', 'name', 'email', 'phone1', 'responsible', 'cep', 'city', 'deletedAt']
    //   });

    //   const states = query.coverage.toUpperCase().split(',').map(cov => cov.trim());

    //   const ongsFiltered = states.flatMap(state => ongs.filter(ong => ong.coverage.includes(state)));

    //   return [...new Map(ongsFiltered.map(ong => [ong['id'], ong])).values()].sort((a, b) => a.id < b.id ? - 1 : 1);
    // }

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
        name: name.normalize().toLowerCase()
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
    const transaction = await this.sequelize.transaction();

    try {
      if (await this.findByEmail(data.email) || await this.findByName(data.name)) throw new HttpException('ONG já cadastrada', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const ong = await this.ongModel.create({ ...data }, { transaction });

      await transaction.commit();

      return ong;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateOng, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
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

      await ong.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const ong = await this.findById(id, 'true');

    if (!st) return await ong.destroy();
    return await ong.restore();
  }
}
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreatePartner, TFilterPartner, TUpdatePartner } from './partner.dto';
import { Partner } from './partner.model';
import { UploadService } from '../config/upload.service';
import { convertBool, trimObj, validateCNPJ } from '../utils';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner)
    private readonly partnerModel: typeof Partner,
    private sequelize: Sequelize,
    private uploadService: UploadService
  ) { }

  async get(query?: TFilterPartner) {
    trimObj(query);
    const where = {};

    if (query.fantasyName) Object.assign(where, { fantasyName: { [$.startsWith]: query.fantasyName.normalize().toLowerCase() } });
    if (query.uf) Object.assign(where, { uf: query.uf.toUpperCase() });

    return await this.partnerModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const partner = await this.partnerModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!partner) throw new HttpException('Parceiro não encontrado', 404);

    return partner;
  }

  async findByEmail(email: string) {
    return await this.partnerModel.findOne({
      where: {
        email: email.toLowerCase()
      }
    });
  }

  async findByCNPJ(cnpj: string) {
    validateCNPJ(cnpj);
    return await this.partnerModel.findOne({
      where: {
        cnpj: cnpj.replace(/[\/\s.-]/g, '')
      }
    });
  }

  async post(data: TCreatePartner, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (await this.findByEmail(data.email) || await this.findByCNPJ(data.cnpj)) throw new HttpException('Parceiro já cadastrado', 400);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      const partner = await this.partnerModel.create({ ...data }, { transaction });

      await transaction.commit();

      return partner;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePartner, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const partner = await this.findById(id);

      if (data.email && data.email !== partner.email) {
        if (await this.findByEmail(data.email)) throw new HttpException('Parceiro já cadastrado', 400);
      }

      if (data.cnpj && data.cnpj !== partner.cnpj) {
        if (await this.findByCNPJ(data.cnpj)) throw new HttpException('Parceiro já cadastrado', 400);
      }

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await partner.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const partner = await this.findById(id, 'true');

    if (!st) return await partner.destroy();
    return await partner.restore();
  }
}
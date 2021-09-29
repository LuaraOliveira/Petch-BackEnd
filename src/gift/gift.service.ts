import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op as $ } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreateGift, TFilterGift, TUpdateGift } from './gift.dto';
import { Gift } from './gift.model';
import { UploadService } from '../config/upload.service';
import { PartnerService } from '../partner/partner.service';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class GiftService {
  constructor(
    @InjectModel(Gift)
    private readonly giftModel: typeof Gift,
    private partnerService: PartnerService,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterGift) {
    trimObj(query);
    const where = {};

    if (query.name) Object.assign(where, { name: { [$.startsWith]: query.name.normalize().toLowerCase() } });

    return await this.giftModel.findAll({
      paranoid: !convertBool(query.inactives),
      where,
      attributes: ['id', 'name', 'description', 'image', 'deletedAt']
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const gift = await this.giftModel.findByPk(id, { paranoid: !convertBool(inactives) });

    if (!gift) throw new HttpException('Brinde não encontrado', 404);

    return gift;
  }

  async post(data: TCreateGift, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (data.partnerId) await this.partnerService.findById(data.partnerId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url
        Object.assign(data, { image });
      }

      const gift = await this.giftModel.create({ ...data }, { transaction });

      await transaction.commit();

      return gift;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdateGift, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const gift = await this.findById(id);

      if (data.partnerId) await this.partnerService.findById(data.partnerId);

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url
        Object.assign(data, { image });
      }

      await gift.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const gift = await this.findById(id, 'true');

    if (!st) return await gift.destroy();
    return await gift.restore();
  }
}
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, Op as $, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TCreatePet, TFilterPet, TUpdatePet } from './pet.dto';
import { Pet } from './pet.model';
import { UploadService } from '../config/upload.service';
import { OngService } from '../ong/ong.service';
import { SpeciesService } from '../species/species.service';
import { User } from '../user/user.model';
import { convertBool, trimObj } from '../utils';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet)
    private readonly petModel: typeof Pet,
    private ongService: OngService,
    private speciesService: SpeciesService,
    private uploadService: UploadService,
    private sequelize: Sequelize
  ) { }

  async find(query?: TFilterPet) {
    trimObj(query);
    const options = {
      userId: null
    };

    if (query.age) Object.assign(options, { age: { [$.startsWith]: query.age } });
    if (query.weight) Object.assign(options, { weight: { [$.startsWith]: query.weight } });
    if (query.cut) Object.assign(options, { cut: convertBool(query.cut) });
    if (query.gender) Object.assign(options, { gender: query.gender });
    if (query.speciesId) Object.assign(options, { speciesId: query.speciesId });
    if (query.uf) Object.assign(options, { ong: where(col('ong.coverage'), { [$.substring]: query.uf.toUpperCase() }) });

    return await this.petModel.findAll({
      where: options,
      order: this.sequelize.random(),
      include: { all: true }
    });
  }

  async get(query?: TFilterPet) {
    trimObj(query);

    return await this.petModel.findAll({
      paranoid: !convertBool(query.inactives),
      attributes: ['id', 'name', 'image', 'gender', 'age', 'deletedAt'],
      order: [['id', 'asc']],
    });
  }

  async findById(id: number, inactives?: boolean) {
    const pet = await this.petModel.findByPk(id, { paranoid: !inactives });

    if (!pet) throw new HttpException('Pet não encontrado', 404);

    return pet;
  }

  async create(data: TCreatePet, media: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    const num = (/([\d])/g);

    try {
      await this.ongService.findById(data.ongId);
      await this.speciesService.findById(data.speciesId);

      if (!media) throw new HttpException('Imagem é obrigatória', 400);

      const image = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { image });

      const age = Number(data.age.match(num)?.join(''));
      if (isNaN(age)) throw new HttpException('Idade inválida', 400);

      const pet = await this.petModel.create({ ...data }, { transaction });

      await transaction.commit();

      return pet;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(id: number, data: TUpdatePet, media: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    const num = (/([\d])/g);

    try {
      const pet = await this.findById(id);

      if (data.ongId) await this.ongService.findById(data.ongId);
      if (data.speciesId) await this.speciesService.findById(data.speciesId);

      if (data.age) {
        const age = Number(data.age.match(num)?.join(''));
        if (isNaN(age)) throw new HttpException('Idade inválida', 400);
      }

      if (media) {
        const image = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { image });
      }

      await pet.update({ ...data }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async adopt(user: User, petId: number) {
    const transaction = await this.sequelize.transaction();

    try {
      const pet = await this.petModel.findOne({
        where: {
          id: petId,
          userId: null
        }
      });

      if (!pet) throw new HttpException('Pet não encontrado', 404);

      await pet.update({ userId: user.id }, { transaction });

      await transaction.commit();

      return { user, pet };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: never, status: 'true' | 'false') {
    const st = convertBool(status);
  }

  async delete(id: number) {
    const pet = await this.findById(id);

    await pet.destroy();
  }

  async restore(id: number) {
    const pet = await this.findById(id, true);

    await pet.restore();
  }
}
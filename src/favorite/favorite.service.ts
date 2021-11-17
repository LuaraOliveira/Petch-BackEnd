import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Favorite } from './favorite.model';
import { PetService } from '../pet/pet.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite)
    private readonly favoriteModel: typeof Favorite,
    private sequelize: Sequelize,
    @Inject(forwardRef(() => PetService))
    private petService: PetService,
  ) { }

  async get(options?: FindOptions) {
    return await this.favoriteModel.findAll(options);
  }

  async post(petId: number, userId: number) {
    await this.petService.findPetToFavorite(petId, userId);

    const favorite = await this.favoriteModel.findOne({
      where: {
        petId,
        userId
      }
    });

    if (favorite) throw new HttpException('Pet já está salvo em seus favoritos', 400);

    const transaction = await this.sequelize.transaction();

    try {
      await this.favoriteModel.create({ petId, userId }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async remove(id: number, userId: number) {
    const favorite = await this.favoriteModel.findOne({
      where: {
        id,
        userId
      }
    });

    if (!favorite) throw new HttpException('Favorito não encontrado', 404);

    const transaction = await this.sequelize.transaction();

    try {
      await favorite.destroy({ force: true, transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}
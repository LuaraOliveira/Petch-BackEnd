import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Dislike } from './dislike.model';
import { PetService } from '../pet/pet.service';

@Injectable()
export class DislikeService {
  constructor(
    @InjectModel(Dislike)
    private readonly dislikeModel: typeof Dislike,
    private sequelize: Sequelize,
    @Inject(forwardRef(() => PetService))
    private petService: PetService,
  ) { }

  async get(options?: FindOptions) {
    return await this.dislikeModel.findAll(options);
  }

  async post(petId: number, userId: number) {
    await this.petService.findById(petId);

    const dislike = await this.dislikeModel.findOne({
      where: {
        petId,
        userId
      }
    });

    if (dislike) throw new HttpException('Pet já recebeu dislike', 400);

    const transaction = await this.sequelize.transaction();

    try {
      await this.dislikeModel.create({ petId, userId }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}
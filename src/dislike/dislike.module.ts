import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DislikeController } from './dislike.controller';
import { Dislike } from './dislike.model';
import { DislikeService } from './dislike.service';
import { PetModule } from '../pet/pet.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Dislike]),
    forwardRef(() => UserModule),
    forwardRef(() => PetModule),
  ],
  controllers: [DislikeController],
  providers: [DislikeService],
  exports: [DislikeService],
})
export class DislikeModule { }
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.model';
import { FavoriteService } from './favorite.service';
import { PetModule } from '../pet/pet.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Favorite]),
    forwardRef(() => UserModule),
    forwardRef(() => PetModule),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule { }
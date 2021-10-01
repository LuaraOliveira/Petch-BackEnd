import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PetController } from './pet.controller';
import { Pet } from './pet.model';
import { PetService } from './pet.service';
import { UploadService } from '../config/upload.service';
import { DislikeModule } from '../dislike/dislike.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { OngModule } from '../ong/ong.module';
import { SpeciesModule } from '../species/species.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Pet]),
    OngModule,
    SpeciesModule,
    DislikeModule,
    UserModule,
    FavoriteModule
  ],
  controllers: [PetController],
  providers: [PetService, UploadService],
  exports: [PetService],
})
export class PetModule { }
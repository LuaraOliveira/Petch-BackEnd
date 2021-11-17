import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SpeciesController } from './species.controller';
import { Species } from './species.model';
import { SpeciesService } from './species.service';
import { UploadService } from '../config/upload.service';

@Module({
  imports:[
    SequelizeModule.forFeature([Species])
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService, UploadService],
  exports: [SpeciesService],
})
export class SpeciesModule { }

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SolicitationController } from './solicitation.controller';
import { Solicitation } from './solicitation.model';
import { SolicitationSeed } from './solicitation.seed';
import { SolicitationService } from './solicitation.service';
import { UploadService } from '../config/upload.service';
import { SolicitationTypesModule } from '../solicitationTypes/solicitationTypes.module';

const imports= [
  SequelizeModule.forFeature([Solicitation]),
  SolicitationTypesModule
]

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([SolicitationSeed]));
}

@Module({
  imports,
  controllers: [SolicitationController],
  providers: [SolicitationService, UploadService],
  exports: [SolicitationService],
})
export class SolicitationModule { }
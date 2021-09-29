import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SolicitationTypesController } from './solicitationTypes.controller';
import { SolicitationTypes } from './solicitationTypes.model';
import { SolicitationTypesSeed } from './solicitationTypes.seed';
import { SolicitationTypesService } from './solicitationTypes.service';

const imports = [
  SequelizeModule.forFeature([SolicitationTypes])
]

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([SolicitationTypesSeed]));
}

@Module({
  imports,
  controllers: [SolicitationTypesController],
  providers: [SolicitationTypesService],
  exports: [SolicitationTypesService],
})
export class SolicitationTypesModule { }

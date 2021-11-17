import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SolicitationTypesController } from './solicitationTypes.controller';
import { SolicitationTypes } from './solicitationTypes.model';
import { SolicitationTypesService } from './solicitationTypes.service';

@Module({
  imports:[
    SequelizeModule.forFeature([SolicitationTypes])
  ],
  controllers: [SolicitationTypesController],
  providers: [SolicitationTypesService],
  exports: [SolicitationTypesService],
})
export class SolicitationTypesModule { }

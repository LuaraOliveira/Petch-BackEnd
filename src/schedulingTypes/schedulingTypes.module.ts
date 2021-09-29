import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { SchedulingTypesController } from './schedulingTypes.controller';
import { SchedulingTypes } from './schedulingTypes.model';
import { SchedulingTypesSeed } from './schedulingTypes.seed';
import { SchedulingTypesService } from './schedulingTypes.service';

const imports = [
  SequelizeModule.forFeature([SchedulingTypes])
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([SchedulingTypesSeed]));
}

@Module({
  imports,
  controllers: [SchedulingTypesController],
  providers: [SchedulingTypesService],
  exports: [SchedulingTypesService],
})
export class SchedulingTypesModule { }

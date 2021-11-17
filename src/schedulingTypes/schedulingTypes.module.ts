import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SchedulingTypesController } from './schedulingTypes.controller';
import { SchedulingTypes } from './schedulingTypes.model';
import { SchedulingTypesService } from './schedulingTypes.service';

@Module({
  imports:[
    SequelizeModule.forFeature([SchedulingTypes])
  ],
  controllers: [SchedulingTypesController],
  providers: [SchedulingTypesService],
  exports: [SchedulingTypesService],
})
export class SchedulingTypesModule { }

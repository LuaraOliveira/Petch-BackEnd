import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OngModule } from '../ong/ong.module';
import { PetModule } from '../pet/pet.module';
import { SchedulingTypesModule } from '../schedulingTypes/schedulingTypes.module';
import { SolicitationTypesModule } from '../solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from '../species/species.module';

@Module({
  imports: [
    OngModule,
    PetModule,
    SchedulingTypesModule,
    SolicitationTypesModule,
    SpeciesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})

export class DashboardModule { }
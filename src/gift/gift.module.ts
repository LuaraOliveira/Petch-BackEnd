import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { GiftController } from './gift.controller';
import { Gift } from './gift.model';
import { GiftSeed } from './gift.seed';
import { GiftService } from './gift.service';
import { UploadService } from '../config/upload.service';
import { PartnerModule } from '../partner/partner.module';

const imports = [
  SequelizeModule.forFeature([Gift]),
  PartnerModule
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([GiftSeed]));
}

@Module({
  imports,
  controllers: [GiftController],
  providers: [GiftService, UploadService],
  exports: [GiftService]
})
export class GiftModule { }
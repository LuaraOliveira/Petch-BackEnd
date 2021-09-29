import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { PartnerController } from './partner.controller';
import { Partner } from './partner.model';
import { PartnerSeed } from './partner.seed';
import { PartnerService } from './partner.service';
import { UploadService } from '../config/upload.service';

const imports = [
  SequelizeModule.forFeature([Partner]),
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([PartnerSeed]));
}

@Module({
  imports,
  controllers: [PartnerController],
  providers: [PartnerService, UploadService],
  exports: [PartnerService],
})
export class PartnerModule { }
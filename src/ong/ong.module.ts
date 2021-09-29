import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { OngController } from './ong.controller';
import { Ong } from './ong.model';
import { OngSeed } from './ong.seed';
import { OngService } from './ong.service';
import { UploadService } from '../config/upload.service';


const imports = [
  SequelizeModule.forFeature([Ong])
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([OngSeed]));
}

@Module({
  imports,
  controllers: [OngController],
  providers: [OngService, UploadService],
  exports: [OngService],
})
export class OngModule { }
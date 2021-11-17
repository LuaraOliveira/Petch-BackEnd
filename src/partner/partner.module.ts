import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PartnerController } from './partner.controller';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';
import { UploadService } from '../config/upload.service';

@Module({
  imports:[    
    SequelizeModule.forFeature([Partner]),
  ],
  controllers: [PartnerController],
  providers: [PartnerService, UploadService],
  exports: [PartnerService],
})
export class PartnerModule { }
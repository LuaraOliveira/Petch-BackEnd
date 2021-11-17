import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RoleController } from './role.controller';
import { Role } from './role.model';
import { RoleService } from './role.service';


@Module({
  imports:[
    SequelizeModule.forFeature([Role])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule { }

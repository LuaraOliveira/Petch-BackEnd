import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { RoleController } from './role.controller';
import { Role } from './role.model';
import { RoleSeed } from './role.seed';
import { RoleService } from './role.service';

const imports = [
  SequelizeModule.forFeature([Role])
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([RoleSeed]));
}

@Module({
  imports,
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule { }

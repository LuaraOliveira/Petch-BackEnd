import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederModule } from 'nestjs-sequelize-seeder';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserSeed } from './user.seed';
import { UserService } from './user.service';
import { UploadService } from '../config/upload.service';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../role/role.module';

const imports = [
  SequelizeModule.forFeature([User]),
  JwtModule.register({
    secret: process.env.JWT_SECRET
  }),
  RoleModule,
  MailModule
];

if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forFeature([UserSeed]));
}

@Module({
  imports,
  controllers: [UserController],
  providers: [UserService, UploadService],
  exports: [UserService],
})
export class UserModule { }
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';
import { UploadService } from '../config/upload.service';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../role/role.module';


@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
    RoleModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, UploadService],
  exports: [UserService],
})
export class UserModule { }
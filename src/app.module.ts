import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { resolve } from 'path';

import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { UploadService } from './config/upload.service';
import { GiftModule } from './gift/gift.module';
import { MailModule } from './mail/mail.module';
import { OngModule } from './ong/ong.module';
import { PartnerModule } from './partner/partner.module';
import { PetModule } from './pet/pet.module';
import { RoleModule } from './role/role.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SchedulingTypesModule } from './schedulingTypes/schedulingTypes.module';
import { SolicitationModule } from './solicitation/solicitation.module';
import { SolicitationTypesModule } from './solicitationTypes/solicitationTypes.module';
import { SpeciesModule } from './species/species.module';
import { UserModule } from './user/user.module';

const imports = [
  ServeStaticModule.forRoot({
    rootPath: './uploads',
    serveRoot: '/files'
  }),
  MulterModule.register({
    dest: resolve('./uploads'),
  }),
  ConfigModule.forRoot(),
  process.env.NODE_ENV === 'dev'
    ? SequelizeModule.forRoot({
      dialect: 'mysql',
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true
    }) : SequelizeModule.forRoot({
      dialect: 'postgres',
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      protocol: 'postgres'
    }),
  SendGridModule.forRoot({
    apiKey: process.env.MAIL_KEY
  }),
  RoleModule,
  SpeciesModule,
  SolicitationTypesModule,
  SchedulingTypesModule,
  UserModule,
  AuthModule,
  OngModule,
  PartnerModule,
  GiftModule,
  SolicitationModule,
  PetModule,
  MailModule,
  SchedulingModule,
];
if (process.env.NODE_ENV === 'dev') {
  imports.push(SeederModule.forRoot({
    runOnlyIfTableIsEmpty: true
  }));
}

@Module({
  imports,
  providers: [
    UploadService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule { }

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { GiftModule } from './gift/gift.module';
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Petch')
    .setDescription('Swagger do Petch')
    .setVersion('1.0.0')
    .addServer(process.env.NODE_ENV === 'dev' ? 'http://localhost:8000' : 'https://petch-dev.herokuapp.com')
    .addBearerAuth({ type: 'http', in: 'header' })
    .addTag('Auth', 'Login dos usuários, registro de novos adotantes, reinicialização de senha')
    .addTag('Gifts', 'Armazenar os brindes que o adotante escolherá ao adotar um pet')
    .addTag('ONGs', 'Armazenar as ONGs cadastradas pelo admin')
    .addTag('Partners', 'Armazenar os parceiros do Petch')
    .addTag('Pets', 'Armazenar os pets do Petch')
    .addTag('Roles', 'Armazenar as funções que os usuários terão dentro da plataforma')
    .addTag('Schedulings', 'Armazenar todos os agendamentos marcados')
    .addTag('Scheduling Types', 'Armazenar os tipos de agendamento que o adotante pode efetuar')
    .addTag('Solicitations', 'Armazenar todas as solicitações que os adotantes enviarem')
    .addTag('Solicitation Types', 'Armazenar os tipos de solicitação que os adotantes podem abrir')
    .addTag('Species', 'Armazenar as espécies de animais da plataforma')
    .addTag('Users', 'Armazenar todos os usuários da plataforma')
    .build();
  const docs = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, GiftModule, OngModule, PartnerModule, PetModule, RoleModule, SchedulingModule, SchedulingTypesModule, SolicitationModule, SolicitationTypesModule, SpeciesModule, UserModule],
  });
  SwaggerModule.setup('swagger', app, docs);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(app.getHttpAdapter()));
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(process.env.PORT || 8000);
}
bootstrap();

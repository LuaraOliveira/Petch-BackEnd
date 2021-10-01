import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { differenceInCalendarYears, parseISO } from 'date-fns';
import { col, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TConfirmRegister, TCreateUser, TFilterUser, TUpdateUser } from './user.dto';
import { User } from './user.model';
import { UploadService } from '../config/upload.service';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';
import { capitalizeFirstLetter, convertBool, createTokenHEX, trimObj, validateCPF } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private roleService: RoleService,
    private uploadService: UploadService,
    private mailService: MailService,
    private sequelize: Sequelize
  ) { }

  async get(query?: TFilterUser) {
    const options = {};

    if (query.gender) Object.assign(options, { gender: query.gender.toUpperCase() });
    if (query.role) Object.assign(options, { role: where(col('role.name'), capitalizeFirstLetter(query.role)) });

    return await this.userModel.findAll({
      paranoid: !convertBool(query.inactives),
      where: options,
      attributes: ['id', 'name', 'email', 'cpf', 'avatar', 'deletedAt'],
    });
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const user = await this.userModel.findByPk(id, {
      paranoid: !convertBool(inactives),
      attributes: {
        exclude: ['hash', 'tokenVerificationEmail', 'tokenResetPassword', 'tokenResetPasswordExpires', 'emailVerified']
      }
    });

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    return user;
  }

  async findByGoogleId(googleId: string) {
    return await this.userModel.findOne({
      where: {
        googleId: googleId.trim()
      }
    });
  }

  async findByCPF(cpf: string) {
    validateCPF(cpf);
    return await this.userModel.findOne({
      where: {
        cpf: cpf.replace(/[-.]/g, '').trim()
      },
      attributes: ['cpf']
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({
      where: {
        email: email.trim().toLowerCase()
      }
    });
  }

  async post(data: TCreateUser, isAdmin: boolean, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (await this.findByCPF(data.cpf) || await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);

      if (!isAdmin) {
        if (!data.password && !data.googleId) throw new HttpException('A senha é obrigatória', 400);
      }

      if (isAdmin) data.password = createTokenHEX(5);

      if (differenceInCalendarYears(Date.now(), parseISO(data.birthday)) < 18) throw new HttpException('Você não tem a idade mínima de 18 anos', 400);

      const role = await this.roleService.getByName(isAdmin ? 'Admin' : 'Adotante');

      if (media) {
        const avatar = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { avatar });
      }

      const user = await this.userModel.create({
        ...data,
        roleId: role.id,
        tokenVerificationEmail: createTokenHEX()
      }, { transaction });

      await transaction.commit();

      return user;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(user: User, data: TUpdateUser, media?: Express.MulterS3.File) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      if (data.email && data.email !== user.email) {
        if (await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);
      }

      if (data.cpf && data.cpf !== user.cpf) {
        if (await this.findByCPF(data.cpf)) throw new HttpException('Usuário já cadastrado', 400);
      }

      if (data.birthday && differenceInCalendarYears(new Date(), parseISO(data.birthday)) < 18) throw new HttpException('Você não tem a idade mínima de 18 anos', 400);

      if (data.oldPassword) {
        const { oldPassword, password } = data;

        switch (true) {
          case !(await user.checkPass(oldPassword)):
            throw new HttpException('Senha atual incorreta', 400);
          case oldPassword === password:
            throw new HttpException('Nova senha não pode ser igual a senha atual', 400);
          default:
            break;
        }
      }

      if (media) {
        const avatar = (await this.uploadService.uploadFile(media)).url;
        Object.assign(data, { avatar });
      }

      await user.update({
        ...data,
        emailVerified: data.email && false,
        tokenVerificationEmail: data.email && createTokenHEX(),
      }, { transaction });

      await transaction.commit();

      if (data.email) await this.mailService.newUser(user);
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async activeInactive(id: number, status: 'true' | 'false') {
    const st = convertBool(status);

    const user = await this.findById(id, 'true');

    if (!st) return await user.destroy();
    return await user.restore();
  }

  async confirmRegister(data: TConfirmRegister) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.findByEmail(data.email);

      switch (true) {
        case !user:
          throw new HttpException('Usuário não encontrado', 404);
        case user.emailVerified:
          throw new HttpException('Usuário já confirmado', 400);
        case user.tokenVerificationEmail !== data.token:
          throw new HttpException('Token inválido', 400);
        default:
          break;
      }

      await user.update({
        tokenVerificationEmail: null,
        emailVerified: true
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }

  }
}
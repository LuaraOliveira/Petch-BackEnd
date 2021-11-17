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

  async all(role: string) {
    return await this.userModel.findAll({
      where: {
        role: where(col('role.name'), capitalizeFirstLetter(role))
      }
    });
  }

  async userWithPet(id: number) {
    return await this.userModel.scope('withPet').findByPk(id);
  }

  async get(query?: TFilterUser) {
    trimObj(query);
    const options = {};

    if (query.gender) Object.assign(options, { gender: query.gender.toUpperCase() });
    if (query.role) Object.assign(options, { role: where(col('role.name'), capitalizeFirstLetter(query.role)) });

    return await this.userModel.findAll({
      paranoid: !convertBool(query.inactives),
      where: options,
      attributes: ['id', 'name', 'email', 'cpf', 'avatar', 'deletedAt'],
    });
  }

  async profile(id: number) {
    const user = (await this.findById(id)).toJSON() as User;

    const [address, number] = user.address.split(',').map(ad => ad.trim());

    return {
      ...user,
      address,
      number,
    };
  }

  async findById(id: number, inactives?: 'true' | 'false') {
    const user = await this.userModel.findByPk(id, {
      paranoid: !convertBool(inactives),
      attributes: {
        exclude: ['hash', 'tokenVerificationEmail', 'tokenResetPassword', 'tokenResetPasswordExpires', 'emailVerified', 'googleId']
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

    if (await this.findByCPF(data.cpf) || await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);

    if (!data.googleId) Object.assign(data, { password: createTokenHEX(5) });

    if (differenceInCalendarYears(Date.now(), parseISO(data.birthday)) < 18) throw new HttpException('Você não tem a idade mínima de 18 anos', 400);

    if (media) {
      const avatar = (await this.uploadService.uploadFile(media)).url;
      Object.assign(data, { avatar });
    }

    const transaction = await this.sequelize.transaction();

    try {
      const { id: roleId } = await this.roleService.getByName(isAdmin ? 'Admin' : 'Adotante');

      const user = await this.userModel.create({
        ...data,
        roleId,
        tokenVerificationEmail: createTokenHEX()
      }, { transaction });

      await transaction.commit();

      await this.mailService.newUser(user, data.password);

      return { message: isAdmin ? 'Usuário cadastrado com sucesso' : 'Registro efetuado com sucesso', background: 'success' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async put(user: User, data: TUpdateUser, media?: Express.MulterS3.File) {
    trimObj(data);

    if (data.email && data.email !== user.email) {
      if (await this.findByEmail(data.email)) throw new HttpException('Usuário já cadastrado', 400);
      Object.assign(data, {
        emailVerified: false,
        tokenVerificationEmail: createTokenHEX(),
      });
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

    const transaction = await this.sequelize.transaction();

    try {
      await user.update({ ...data }, { transaction });

      await transaction.commit();

      if (data.email !== user.email) await this.mailService.updateEmail(user);

      return {
        message: 'Cadastrado editado com sucesso',
        background: 'success',
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }
      };
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
    const user = await this.findByEmail(data.email);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    switch (true) {
      case user.emailVerified:
        throw new HttpException('Usuário já confirmado', 400);
      case user.tokenVerificationEmail !== data.token:
        throw new HttpException('Token inválido', 400);
      default:
        break;
    }

    const transaction = await this.sequelize.transaction();

    try {
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
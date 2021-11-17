import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addHours, isAfter } from 'date-fns';
import { Sequelize } from 'sequelize-typescript';

import { TForgotPassword, TGoogleLogin, TLogin, TResetPassword } from './auth.dto';
import { MailService } from '../mail/mail.service';
import { TCreateUser } from '../user/user.dto';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { createTokenHEX, trimObj } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private sequelize: Sequelize,
    private mailService: MailService
  ) { }

  async login(data: TLogin) {
    trimObj(data);

    const user = await this.userService.findByEmail(data.email);

    if (!user || !(await user.checkPass(data.password))) throw new HttpException('As credenciais estão incorretas', 400);

    if (!user.emailVerified) throw new HttpException('E-mail não verificado', 400);

    const auth = await this.createTokenJwt(user);

    return auth;
  }

  async validate(payload: { email: string; }) {
    return await this.userService.findByEmail(payload.email);
  }

  async forgotPassword({ email }: TForgotPassword) {
    const tokenResetPassword = createTokenHEX(), tokenResetPasswordExpires = addHours(new Date(), 1);

    const user = await this.userService.findByEmail(email);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    const transaction = await this.sequelize.transaction();

    try {
      await user.update({
        tokenResetPassword,
        tokenResetPasswordExpires,
      }, { transaction });

      await transaction.commit();

      await this.mailService.forgotPassword(user);
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async resetPassword(data: TResetPassword) {
    trimObj(data);

    const user = await this.userService.findByEmail(data.email);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    switch (true) {
      case data.token !== user.tokenResetPassword:
        throw new HttpException('Token inválido', 400);
      case isAfter(new Date(), user.tokenResetPasswordExpires):
        throw new HttpException('Token expirou', 400);
      case await user.checkPass(data.password):
        throw new HttpException('Nova senha não pode ser igual a senha atual', 400);
      default:
        break;
    }

    const transaction = await this.sequelize.transaction();

    try {
      await user.update({
        ...data,
        tokenResetPassword: null,
        tokenResetPasswordExpires: null,
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async register(data: TCreateUser) {
    return await this.userService.post(data, false);
  }

  private async createTokenJwt(user: User) {
    const { id, name, avatar, email, cpf, role } = user;

    const token = this.jwtService.sign({ id, email, role: role.name, cpf, password: user.hash, google: user.googleId });

    return {
      token,
      user: {
        id,
        name,
        avatar,
        role: role.name
      }
    };
  }

  async googleLogin(data: TGoogleLogin) {
    trimObj(data);

    const [userByGoogle, userByEmail] = await Promise.all([
      this.userService.findByGoogleId(data.googleId),
      this.userService.findByEmail(data.email)
    ]);

    let user: User;

    if (!userByGoogle && !userByEmail) throw new HttpException('Usuário não encontrado', 404);

    if (userByGoogle) {
      if (userByGoogle.role.name.toLowerCase() === 'admin') throw new HttpException('Você não tem permissão para este login', 400);
      if (!userByGoogle.emailVerified) throw new HttpException('E-mail não verificado', 400);

      user = userByGoogle;
    }

    if (!userByGoogle && userByEmail) {
      if (userByEmail.role.name.toLowerCase() === 'admin') throw new HttpException('Você não tem permissão para este login', 400);
      if (!userByEmail.emailVerified) throw new HttpException('E-mail não verificado', 400);

      user = userByEmail;
    }

    const transaction = await this.sequelize.transaction();

    try {
      await user.update({ ...data }, { transaction });

      const auth = await this.createTokenJwt(user);

      await transaction.commit();

      return auth;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isAfter } from 'date-fns';
import { Sequelize } from 'sequelize-typescript';

import { TForgotPassword, TGoogleLogin, TLogin, TResetPassword } from './auth.dto';
import { TCreateUser } from '../user/user.dto';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { createTokenHEX, trimObj } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private sequelize: Sequelize
  ) { }

  async login(data: TLogin) {
    trimObj(data);

    try {
      const user = await this.userService.findByEmail(data.email);

      if (!user || !(await user.checkPass(data.password))) throw new HttpException('As credenciais estão incorretas', 400);

      if (!user.emailVerified) throw new HttpException('E-mail não verificado', 400);

      const auth = await this.createTokenJwt(user);

      return auth;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async validate(payload: { email: string; }) {
    return await this.userService.findByEmail(payload.email);
  }

  async forgotPassword({ email }: TForgotPassword) {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userService.findByEmail(email);

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      const token = createTokenHEX(), now = new Date().setHours(new Date().getHours() + 1);

      await user.update({
        tokenResetPassword: token,
        tokenResetPasswordExpires: now.toString(),
      }, { transaction });

      await transaction.commit();

      return { token };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }

  async resetPassword(data: TResetPassword) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userService.findByEmail(data.email);

      switch (true) {
        case !user:
          throw new HttpException('Usuário não encontrado', 404);
        case data.token !== user.tokenResetPassword:
          throw new HttpException('Token inválido', 400);
        case isAfter(new Date(), Number(user.tokenResetPasswordExpires)):
          throw new HttpException('Token expirou', 400);
        case await user.checkPass(data.password):
          throw new HttpException('Nova senha não pode ser igual a senha atual', 400);
        default:
          break;
      }

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

  async register(data: TCreateUser, media?: Express.MulterS3.File) {
    return await this.userService.post(data, false, media);
  }

  private async createTokenJwt(user: User) {
    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role.name, cpf: user.cpf, password: user.hash, google: user.googleId });

    const { role } = await this.jwtService.verifyAsync(token);

    return { token, role };
  }

  async googleLogin(data: TGoogleLogin) {
    trimObj(data);
    const transaction = await this.sequelize.transaction();

    try {
      const [userByGoogle, userByEmail] = await Promise.all([
        this.userService.findByGoogleId(data.googleId),
        this.userService.findByEmail(data.email)
      ]);

      if (!userByGoogle && !userByEmail) throw new HttpException('Usuário não encontrado', 404);

      if (userByGoogle) {
        await userByGoogle.update({ ...data }, { transaction });

        const auth = await this.createTokenJwt(userByGoogle);

        await transaction.commit();

        return auth;
      }

      if (!userByGoogle && userByEmail) {
        if (userByEmail.role.name.toLowerCase() === 'admin') throw new HttpException('Você não tem permissão para este login', 400);

        await userByEmail.update({ ...data }, { transaction });

        const auth = await this.createTokenJwt(userByEmail);

        await transaction.commit();

        return auth;
      }
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, 400);
    }
  }
}
import { HttpException, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

import { User } from '../user/user.model';

@Injectable()
export class MailService {
  constructor(
    @InjectSendGrid()
    private client: SendGridService
  ) { }

  async newUser(user: User, password?: string) {
    const envelope = {
      templateId: "d-33ea0599dc0948e083afc24ed51c69ab",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Bem-Vindo(a) ao Petch!!",
              name: user.name,
              link: `https://petch-front.herokuapp.com/adopter/RegisterConfirmation?token=${user.tokenVerificationEmail}&email=${user.email}`,
              password
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateEmail(user: User) {
    const envelope = {
      templateId: "d-157f2c470cc3446ab3ed8a2f14f0e8e8",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Confirmação de e-mail",
              name: user.name,
              link: `https://petch-front.herokuapp.com/adopter/RegisterConfirmation?token=${user.tokenVerificationEmail}&email=${user.email}`,
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async forgotPassword(user: User) {
    const envelope = {
      templateId: "d-83ded5f9282e48d0a5921780031fe238",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Esqueceu sua senha?",
              name: user.name,
              link: `https://petch-front.herokuapp.com/Adopter/AlterPassword?token=${user.tokenResetPassword}&email=${user.email}`
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async newScheduling(user: User, date: string, schedulingTypeName: string) {
    const envelope = {
      templateId: "d-c5227df320394815a2e5d4d37b67a60c",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Agendamento confirmado!!",
              name: user.name,
              date,
              schedulingTypeName,
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async cancelScheduling(user: User, date: string, schedulingTypeName: string) {
    const envelope = {
      templateId: "d-e1b080d5343f445091f7ec2b6453f173",
      from: "NoReply <projetopetch@gmail.com>"
    };

    try {
      await this.client.send({
        ...envelope,
        personalizations: [
          {
            to: user.email,
            dynamicTemplateData: {
              subject: "Agendamento cancelado!!",
              name: user.name,
              date,
              schedulingTypeName,
            }
          }
        ],
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
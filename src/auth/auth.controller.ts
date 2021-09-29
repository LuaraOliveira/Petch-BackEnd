import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TForgotPassword, TGoogleLogin, TLogin, TResetPassword } from './auth.dto';
import { AuthService } from './auth.service';
import { config } from '../config/multer';
import { TCreateUser, User } from '../user/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Efetuar login com e-mail e senha' })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '456fda'
        },
        role: {
          type: 'string',
          example: 'Admin'
        },
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'Campo "X" é obrigatório' },
            { example: 'As credenciais estão incorretas' },
            { example: 'E-mail inválido' },
            { example: 'E-mail não verificado' },
          ]
        },
      }
    }
  })
  @ApiBody({ type: TLogin })
  @Post('login')
  @HttpCode(200)
  async login(@Body() data: TLogin) {
    return await this.authService.login(data);
  }

  @ApiOperation({ summary: 'Efetuar login com Google' })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '456fda'
        },
        role: {
          type: 'string',
          example: 'Admin'
        },
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'Campo "X" é obrigatório' },
            { example: 'E-mail inválido' },
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: TGoogleLogin })
  @Post('/login/google')
  @HttpCode(200)
  async googleLogin(@Body() data: TGoogleLogin) {
    return await this.authService.googleLogin(data);
  }

  @ApiOperation({ summary: 'Registrar-se' })
  @ApiCreatedResponse({ type: User, description: 'Created' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'Arquivo não suportado' },
            { example: 'Usuário já cadastrado' },
            { example: 'CEP inválido' },
            { example: 'CPF inválido' },
            { example: 'E-mail inválido' },
            { example: 'Número de telefone/celular inválido' },
            { example: 'Senha muito curta' },
            { example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' },
            { example: 'Senhas não correspondem' },
            { example: 'Data de nascimento inválida' },
            { example: 'Você não tem a idade mínima de 18 anos' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateUser })
  @Post('register')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async register(@Body() data: TCreateUser, @UploadedFile() media: Express.MulterS3.File) {
    return await this.authService.register(data, media);
  }

  @ApiOperation({ summary: 'Solicitar troca de senha por esquecimento' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'E-mail é obrigatório' },
            { example: 'E-mail inválido' },
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: TForgotPassword })
  @Post('forgot')
  @HttpCode(200)
  async forgot(@Body() data: TForgotPassword) {
    return await this.authService.forgotPassword(data);
  }

  @ApiOperation({ summary: 'Reiniciar a senha a partir de seu esquecimento' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'Campo "X" é obrigatório' },
            { example: 'E-mail inválido' },
            { example: 'Token inválido' },
            { example: 'Token expirou' },
            { example: 'Nova senha não pode ser igual a senha atual' },
            { example: 'Nova senha e confirmação de senha não correspodem' },
            { example: 'Senha muito curta' },
            { example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' },
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404
        },
        message: {
          type: 'string',
          example: 'Usuário não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: TResetPassword })
  @Post('reset')
  @HttpCode(200)
  async reset(@Body() data: TResetPassword) {
    return await this.authService.resetPassword(data);
  }
}
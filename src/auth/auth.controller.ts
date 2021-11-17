import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TForgotPassword, TGoogleLogin, TLogin, TResetPassword, TReturnLogin } from './auth.dto';
import { AuthService } from './auth.service';
import { TCreateUser, User } from '../user/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Efetuar login com e-mail e senha' })
  @ApiOkResponse({ type: TReturnLogin, description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
            {
              type: 'string',
              example: 'As credenciais estão incorretas'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'E-mail não verificado'
            },
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
  @ApiOkResponse({ type: TReturnLogin, description: 'Success' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
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
        background: {
          type: 'string',
          example: 'error',
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
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Usuário já cadastrado'
            },
            {
              type: 'string',
              example: 'CEP inválido'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'CPF inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Número de telefone/celular inválido'
            },
            {
              type: 'string',
              example: 'Senha precisa conter, no mínimo, 8 caracteres'
            },
            {
              type: 'string',
              example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número'
            },
            {
              type: 'string',
              example: 'Senhas não correspondem'
            },
            {
              type: 'string',
              example: 'Data de nascimento inválida'
            },
            {
              type: 'string',
              example: 'Você não tem a idade mínima de 18 anos'
            },
          ]
        },
      }
    }
  })
  @ApiBody({ type: TCreateUser })
  @Post('register')
  async register(@Body() data: TCreateUser) {
    return await this.authService.register(data);
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
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'E-mail é obrigatório'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
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
        background: {
          type: 'string',
          example: 'error',
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

  @ApiOperation({ summary: 'Redefinir a senha a partir de seu esquecimento' })
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
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          oneOf: [
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Token inválido'
            },
            {
              type: 'string',
              example: 'Token expirou'
            },
            {
              type: 'string',
              example: 'Nova senha não pode ser igual a senha atual'
            },
            {
              type: 'string',
              example: 'Nova senha e confirmação de senha não correspodem'
            },
            {
              type: 'string',
              example: 'Senha precisa conter, no mínimo, 8 caracteres'
            },
            {
              type: 'string',
              example: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número'
            },
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
        background: {
          type: 'string',
          example: 'error',
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
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { IndexUser, TConfirmRegister, TCreateUser, TFilterUser, TRegisteredUser, TUpdateUser, User } from './user.dto';
import { UserService } from './user.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Users')
@ApiUnauthorizedResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 401,
      },
      background: {
        type: 'string',
        example: 'error',
      },
      message: {
        type: 'string',
        example: 'Não autorizado'
      }
    }
  }
})
@ApiForbiddenResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 403,
      },
      background: {
        type: 'string',
        example: 'error',
      },
      message: {
        type: 'string',
        example: 'Você não tem permissão'
      }
    }
  }
})
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all(@Query('role') role: string) {
    return await this.userService.all(role)
  }

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiOkResponse({ type: [IndexUser], description: 'Success' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get()
  async index(@Query() query?: TFilterUser) {
    return await this.userService.get(query);
  }

  @ApiOperation({ summary: 'Perfil do usuário logado' })
  @ApiOkResponse({ type: User, description: 'Success' })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
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
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request) {
    return await this.userService.profile(req.user.id);
  }

  @ApiOperation({ summary: 'Listar um usuário pelo ID' })
  @ApiOkResponse({ type: User, description: 'Success' })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
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
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: false })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterUser, 'inactives'>) {
    return await this.userService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar um novo admin' })
  @ApiCreatedResponse({ type: TRegisteredUser, description: 'Created' })
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
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'Campo "X" é obrigatório'
            },
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
              example: 'CPF inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'Data de nascimento inválida'
            },
            {
              type: 'string',
              example: 'Você não tem a idade mínima de 18 anos'
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
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateUser })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.post(data, true, media);
  }

  @ApiOperation({ summary: 'Editar os próprios dados' })
  @ApiOkResponse({ type: TRegisteredUser, description: 'Success' })
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
              example: 'Arquivo não suportado'
            },
            {
              type: 'string',
              example: 'Campo "X" não pode ser vazio'
            },
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
              example: 'CPF inválido'
            },
            {
              type: 'string',
              example: 'E-mail inválido'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Telefone inválido'
            },
            {
              type: 'string',
              example: 'Data de nascimento inválida'
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
              example: 'Senha atual incorreta'
            },
            {
              type: 'string',
              example: 'Nova senha é obrigatória'
            },
            {
              type: 'string',
              example: 'Nova senha não pode ser igual a senha atual'
            },
            {
              type: 'string',
              example: 'Confirmação de senha é obrigatória'
            },
            {
              type: 'string',
              example: 'Nova senha e confirmação de senha não correspondem'
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdateUser })
  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Req() req: Request, @Body() data: TUpdateUser, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.userService.put(req.user, data, media);
  }

  @ApiOperation({ summary: 'Confirmar o usuário' })
  @ApiNoContentResponse({ description: 'No Content' })
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
            {
              type: 'string',
              example: 'Token não informado'
            },
            {
              type: 'string',
              example: 'Usuário já confirmado'
            },
            {
              type: 'string',
              example: 'Token inválido'
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
  @ApiQuery({ type: TConfirmRegister, required: true })
  @Patch('/confirm')
  async confirmRegister(@Query() data: TConfirmRegister) {
    return await this.userService.confirmRegister(data);
  }

  @ApiOperation({ summary: 'Ativar e inativar um usuário' })
  @ApiNoContentResponse({ description: 'No Content' })
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
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.userService.activeInactive(id, status);
  }
}
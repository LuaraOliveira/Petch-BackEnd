import { Body, Controller, Delete, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Solicitation, TCreateSolicitation, TRegisteredSolicitation } from './solicitation.dto';
import { SolicitationService } from './solicitation.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Solicitations')
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
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('solicitations')
export class SolicitationController {
  constructor(
    private solicitationService: SolicitationService,
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all() {
    return await this.solicitationService.get();
  }

  @ApiOperation({ summary: 'Listar todas as solicitações' })
  @ApiOkResponse({ type: [Solicitation], description: 'Success' })
  @RoleDecorator('admin')
  @Get()
  async index() {
    return await this.solicitationService.get();
  }

  @ApiOperation({ summary: 'Listar uma solicitação pelo ID' })
  @ApiOkResponse({ type: Solicitation, description: 'Success' })
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
          example: 'Solicitação não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.solicitationService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar uma nova solicitação' })
  @ApiCreatedResponse({ type: TRegisteredSolicitation, description: 'Created' })
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
          example: 404,
        },
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'Tipo de solicitação não encontrada',
        },
      }
    }
  })
  @ApiBody({ type: TCreateSolicitation })
  @RoleDecorator('adotante')
  @Post()
  async create(@Body() data: TCreateSolicitation, @Req() req: Request) {
    return await this.solicitationService.post(data, req.user);
  }

  @ApiOperation({ summary: 'Inativar uma solicitação' })
  @ApiNoContentResponse({ description: 'No Content' })
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
          example: 'Solicitação não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.solicitationService.delete(id);
  }
}
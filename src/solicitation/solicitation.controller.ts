import { Body, Controller, Delete, Get, HttpCode, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { Solicitation, TCreateSolicitation } from './solicitation.dto';
import { SolicitationService } from './solicitation.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard, OptionalAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Solicitations')
@Controller('solicitations')
export class SolicitationController {
  constructor(
    private solicitationService: SolicitationService,
  ) { }

  @ApiOperation({ summary: 'Listar todas as solicitações' })
  @ApiOkResponse({ type: [Solicitation], description: 'Success' })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Unauthorized'
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
        message: {
          type: 'string',
          example: 'Você não tem permissão'
        }
      }
    }
  })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @RoleDecorator('admin')
  @Get()
  async index() {
    return await this.solicitationService.get();
  }

  @ApiOperation({ summary: 'Listar uma solicitação pelo ID' })
  @ApiOkResponse({ type: Solicitation, description: 'Success' })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Unauthorized'
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
        message: {
          type: 'string',
          example: 'Você não tem permissão'
        }
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
        message: {
          type: 'string',
          example: 'Solicitação não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.solicitationService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar uma nova solicitação' })
  @ApiCreatedResponse({ type: Solicitation, description: 'Created' })
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
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Tipo de solicitação não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateSolicitation })
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateSolicitation, @UploadedFile() media: Express.MulterS3.File, @Req() req: Request) {
    return await this.solicitationService.post(data, media, req.user);
  }

  @ApiOperation({ summary: 'Inativar uma solicitação' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Unauthorized'
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
        message: {
          type: 'string',
          example: 'Você não tem permissão'
        }
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
        message: {
          type: 'string',
          example: 'Solicitação não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.solicitationService.delete(id);
  }
}
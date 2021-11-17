import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { IndexPartner, Partner, TCreatePartner, TFilterPartner, TRegisteredPartner, TUpdatePartner } from './partner.dto';
import { PartnerService } from './partner.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Partners')
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
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
  description: 'Forbidden',
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
@RoleDecorator('admin')
@Controller('partners')
export class PartnerController {
  constructor(
    private partnerService: PartnerService
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all() {
    return await this.partnerService.all();
  }

  @ApiOperation({ summary: 'Listar todos os parceiros' })
  @ApiOkResponse({ type: [IndexPartner], description: 'Success' })
  @Get()
  async index(@Query() query?: TFilterPartner) {
    return await this.partnerService.get(query);
  }

  @ApiOperation({ summary: 'Listar um parceiro pelo ID' })
  @ApiOkResponse({ type: Partner, description: 'Success' })
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
          example: 'Parceiro não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterPartner, 'inactives'>) {
    return await this.partnerService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar um novo parceiro' })
  @ApiCreatedResponse({ type: TRegisteredPartner, description: 'Created' })
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
              example: 'E-mail é inválido'
            },
            {
              type: 'string',
              example: 'CNPJ é inválido'
            },
            {
              type: 'string',
              example: 'Website é inválido'
            },
            {
              type: 'string',
              example: 'Telefone é inválido'
            },
            {
              type: 'string',
              example: 'CEP é inválido'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreatePartner })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar um parceiro' })
  @ApiOkResponse({ type: TRegisteredPartner, description: 'Success' })
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
              example: 'E-mail é inválido'
            },
            {
              type: 'string',
              example: 'CNPJ é inválido'
            },
            {
              type: 'string',
              example: 'Website é inválido'
            },
            {
              type: 'string',
              example: 'Telefone é inválido'
            },
            {
              type: 'string',
              example: 'CEP é inválido'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdatePartner })
  @ApiParam({ name: 'id', required: true })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdatePartner, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.partnerService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Ativar e inativar um parceiro' })
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
          example: 'Parceiro não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.partnerService.activeInactive(id, status);
  }
}
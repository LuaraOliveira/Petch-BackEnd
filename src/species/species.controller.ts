import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { SpeciesService } from './species.service';
import { IndexSpecies, Species, TCreateSpecies, TUpdateSpecies, TFilterSpecies, TRegisteredSpecies } from './species.dto';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Species')
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
@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService,
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all() {
    return await this.speciesService.all();
  }

  @ApiOperation({ summary: 'Listar todas as espécies' })
  @ApiOkResponse({ type: [IndexSpecies], description: 'Success' })
  @ApiQuery({ type: TFilterSpecies, required: false })
  @Get()
  async index(@Query() query?: TFilterSpecies) {
    return await this.speciesService.get(query);
  }

  @ApiOperation({ summary: 'Listar uma espécie pelo ID' })
  @ApiOkResponse({ type: Species, description: 'Success' })
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: true })
  @RoleDecorator('admin')
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterSpecies, 'inactives'>) {
    return await this.speciesService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar uma nova espécie' })
  @ApiCreatedResponse({ type: TRegisteredSpecies, description: 'Created' })
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
              example: 'Espécie já cadastrada'
            },
            {
              type: 'string',
              example: 'Nome é obrigatório'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateSpecies })
  @RoleDecorator('admin')
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar uma espécie' })
  @ApiOkResponse({ type: TRegisteredSpecies, description: 'Success' })
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
              example: 'Espécie já cadastrada'
            },
            {
              type: 'string',
              example: 'Nome é obrigatório'
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdateSpecies })
  @ApiParam({ name: 'id', required: true })
  @RoleDecorator('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Ativar e inativar uma espécie' })
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @RoleDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.speciesService.activeInactive(id, status);
  }
}

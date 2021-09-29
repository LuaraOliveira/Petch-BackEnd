import { Body, Controller, Delete, Get, HttpCode, Param, ParseArrayPipe, Patch, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SpeciesService } from './species.service';
import { IndexSpecies, Species, TCreateSpecies, TUpdateSpecies, TFilterSpecies } from './species.dto';
import { config } from '../config/multer';

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService,
  ) { }

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
        message: {
          type: 'string',
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: true })
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterSpecies, 'inactives'>) {
    return await this.speciesService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar uma nova espécie' })
  @ApiCreatedResponse({ type: Species, description: 'Created' })
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
            { example: 'Espécie já cadastrada' },
            { example: 'Nome é obrigatório' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateSpecies })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateSpecies, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.speciesService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar uma espécie' })
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
            { example: 'Arquivo não suportado' },
            { example: 'Espécie já cadastrada' },
            { example: 'Nome é obrigatório' },
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
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdateSpecies })
  @ApiParam({ name: 'id', required: true })
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
        message: {
          type: 'string',
          example: 'Espécie não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.speciesService.activeInactive(id, status);
  }
}

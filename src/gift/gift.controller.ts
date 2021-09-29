import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { TCreateGift, TFilterGift, Gift, IndexGift, TUpdateGift } from './gift.dto';
import { GiftService } from './gift.service';
import { config } from '../config/multer';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftController {
  constructor(
    private giftService: GiftService
  ) { }

  @ApiOperation({ summary: 'Listar todos os brindes' })
  @ApiOkResponse({ type: [IndexGift], description: 'Success' })
  @Get()
  async index(@Query() query?: TFilterGift) {
    return await this.giftService.get(query);
  }

  @ApiOperation({ summary: 'Listar um brinde pelo ID' })
  @ApiOkResponse({ type: Gift, description: 'Success' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'string', enum: ['true', 'false'], required: false })
  @Get(':id')
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterGift, 'inactives'>) {
    return await this.giftService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar um novo brinde' })
  @ApiCreatedResponse({ type: Gift, description: 'Created' })
  @ApiBadRequestResponse({
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
          example: 'Parceiro não encontrado',
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreateGift })
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.post(data, media);
  }

  @ApiOperation({ summary: 'Editar um brinde' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
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
          ]
        },
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          oneOf: [
            { example: 'Brinde não encontrado' },
            { example: 'Parceiro não encontrado' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: TUpdateGift })
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdateGift, @UploadedFile() media?: Express.MulterS3.File) {
    return await this.giftService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Ativar e inativar um brinde' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Brinde não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'status', type: 'string', enum: ['true', 'false'], required: true })
  @Delete(':id')
  @HttpCode(204)
  async activeInactive(@Param('id') id: number, @Query('status') status: 'true' | 'false') {
    return await this.giftService.activeInactive(id, status);
  }
}
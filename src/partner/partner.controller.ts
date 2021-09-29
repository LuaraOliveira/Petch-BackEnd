import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { IndexPartner, Partner, TCreatePartner, TFilterPartner, TUpdatePartner } from './partner.dto';
import { PartnerService } from './partner.service';
import { config } from '../config/multer';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(
    private partnerService: PartnerService
  ) { }

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
  @ApiCreatedResponse({ type: Partner, description: 'Created' })
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
            { example: 'E-mail é inválido' },
            { example: 'CNPJ é inválido' },
            { example: 'Website é inválido' },
            { example: 'Telefone é inválido' },
            { example: 'CEP é inválido' },
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
            { example: 'E-mail é inválido' },
            { example: 'CNPJ é inválido' },
            { example: 'Website é inválido' },
            { example: 'Telefone é inválido' },
            { example: 'CEP é inválido' },
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
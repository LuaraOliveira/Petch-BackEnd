import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Pet, TCreatePet, TFilterPet, TUpdatePet } from './pet.dto';
import { PetService } from './pet.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { config } from '../config/multer';

@ApiTags('Pets')
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
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
  description: 'Forbidden',
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
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService
  ) { }

  @ApiOperation({ summary: 'Procurar pet para adoção e listar todos os pets' })
  @ApiOkResponse({ type: [Pet], description: 'Success' })
  @ApiQuery({ type: TFilterPet, required: false })
  @Get()
  async index(@Req() req: Request, @Query() query?: TFilterPet) {
    if (req.user.role.name === 'Adotante') return await this.petService.find(query);
    return await this.petService.get(query);
  }

  @ApiOperation({ summary: 'Listar um pet pelo ID' })
  @ApiOkResponse({ type: Pet, description: 'Success' })
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'inactives', type: 'boolean', required: false })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.petService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar um pet' })
  @ApiCreatedResponse({ type: Pet, description: 'Created' })
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
            { example: 'Idade inválida' },
            { example: 'Gênero inválido' },
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
          oneOf: [
            { example: 'ONG não encontrada' },
            { example: 'Espécie não encontrada' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TCreatePet })
  @RoleDecorator('admin')
  @Post()
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async create(@Body() data: TCreatePet, @UploadedFile() media: Express.MulterS3.File) {
    return await this.petService.create(data, media);
  }

  @ApiOperation({ summary: 'Adotar um pet' })
  @ApiCreatedResponse({ type: Pet, description: 'Created' })
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
            { example: 'Idade inválida' },
            { example: 'Gênero inválido' },
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
          oneOf: [
            { example: 'ONG não encontrada' },
            { example: 'Espécie não encontrada' },
          ]
        },
      }
    }
  })
  @RoleDecorator('adotante')
  @Patch(':id')
  async adopt(@Req() req: Request, @Param('id') id: number) {
    return await this.petService.adopt(req.user, id);
  }

  @ApiOperation({ summary: 'Editar um pet' })
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
            { example: 'Campo "X" é obrigatório' },
            { example: 'Idade inválida' },
            { example: 'Gênero inválido' },
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
          oneOf: [
            { example: 'Pet não encontrado' },
            { example: 'ONG não encontrada' },
            { example: 'Espécie não encontrada' },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdatePet })
  @ApiParam({ name: 'id', required: true })
  @RoleDecorator('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdatePet, @UploadedFile() media: Express.MulterS3.File) {
    return await this.petService.put(id, data, media);
  }

  // @ApiOperation({ summary: 'Reativar um pet' })
  // @ApiNoContentResponse({ description: 'No Content' })
  // @ApiNotFoundResponse({
  //   description: 'Not Found',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       statusCode: {
  //         type: 'number',
  //         example: 404,
  //       },
  //       message: {
  //         type: 'string',
  //         example: 'Pet não encontrado',
  //       },
  //     }
  //   }
  // })
  // @ApiParam({ name: 'id', required: true })
  // @Patch(':id')
  // @HttpCode(204)
  // async restore(@Param('id') id: number) {
  //   return await this.petService.restore(id);
  // }

  @ApiOperation({ summary: 'Inativar um pet' })
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return await this.petService.delete(id);
  }
}
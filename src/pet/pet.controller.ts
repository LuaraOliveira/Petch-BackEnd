import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Pet, TChooseGift, TCreatePet, TFilterPet, TRegisteredPet, TUpdatePet } from './pet.dto';
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
@Controller('pets')
export class PetController {
  constructor(
    private petService: PetService
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all() {
    return await this.petService.all();
  }

  @ApiOperation({ summary: 'Procurar pet para adoção e listar todos os pets' })
  @ApiOkResponse({ type: [Pet], description: 'Success' })
  @ApiQuery({ type: TFilterPet, required: false })
  @Get()
  async index(@Req() req: Request, @Query() query?: TFilterPet) {
    if (req.user.role.name === 'Adotante') return await this.petService.find(req.user.id, query);
    return await this.petService.get(query);
  }

  @ApiOperation({ summary: 'Listar pets adotados pelo usuário' })
  @ApiOkResponse({ type: [Pet], description: 'Success' })
  @RoleDecorator('adotante')
  @Get('mypets')
  async myPets(@Req() req: Request) {
    return await this.petService.myPets(req.user.id);
  }

  @ApiOperation({ summary: 'Listar pets favoritos do usuário logado' })
  @ApiOkResponse({ type: [Pet], description: 'Success' })
  @RoleDecorator('adotante')
  @Get('favorites')
  async myFavorites(@Req() req: Request) {
    return await this.petService.findMyFavorites(req.user.id);
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
        background: {
          type: 'string',
          example: 'error',
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
  async byId(@Param('id') id: number, @Query() { inactives }: Pick<TFilterPet, 'inactives'>) {
    return await this.petService.findById(id, inactives);
  }

  @ApiOperation({ summary: 'Cadastrar um pet' })
  @ApiCreatedResponse({ type: TRegisteredPet, description: 'Created' })
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
              example: 'Idade inválida'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Peso inválido'
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
          oneOf: [
            {
              type: 'string',
              example: 'ONG não encontrada'
            },
            {
              type: 'string',
              example: 'Espécie não encontrada'
            },
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
  @ApiOkResponse({ type: TRegisteredPet, description: 'Success' })
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
              example: 'Idade inválida'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
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
          oneOf: [
            {
              type: 'string',
              example: 'ONG não encontrada'
            },
            {
              type: 'string',
              example: 'Espécie não encontrada'
            },
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

  @ApiOperation({ summary: 'Adotante escolhe um brinde após a adoção' })
  @ApiOkResponse({ description: 'Success' })
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
          oneOf: [
            {
              type: 'string',
              example: 'Brinde não encontrado'
            },
            {
              type: 'string',
              example: 'Pet não encontrado'
            },
          ]
        },
      }
    }
  })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiParam({ name: 'giftId', type: 'number', required: true })
  @RoleDecorator('adotante')
  @Patch(':id/gift/:giftId')
  async chooseGift(@Req() req: Request, @Param() { id, giftId }: TChooseGift) {
    return await this.petService.chooseGift(req.user, id, giftId);
  }

  @ApiOperation({ summary: 'Editar um pet' })
  @ApiOkResponse({ type: TRegisteredPet, description: 'Success' })
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
              example: 'Idade inválida'
            },
            {
              type: 'string',
              example: 'Gênero inválido'
            },
            {
              type: 'string',
              example: 'Peso inválido'
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
          oneOf: [
            {
              type: 'string',
              example: 'Pet não encontrado'
            },
            {
              type: 'string',
              example: 'ONG não encontrada'
            },
            {
              type: 'string',
              example: 'Espécie não encontrada'
            },
          ]
        },
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: TUpdatePet })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @RoleDecorator('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('media', process.env.NODE_ENV === 'dev' ? config : {}))
  async update(@Param('id') id: number, @Body() data: TUpdatePet, @UploadedFile() media: Express.MulterS3.File) {
    return await this.petService.put(id, data, media);
  }

  @ApiOperation({ summary: 'Ativar e inativar um pet' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({
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
          example: 'Pet não encontrado',
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
    return await this.petService.activeInactive(id, status);
  }
}
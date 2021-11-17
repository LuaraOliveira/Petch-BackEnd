import { Controller, Delete, HttpCode, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { TCreateFavorite } from './favorite.dto';
import { FavoriteService } from './favorite.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Favorites')
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
@RoleDecorator('adotante')
@Controller('favorites')
export class FavoriteController {
  constructor(
    private favoriteService: FavoriteService
  ) { }

  @ApiOperation({ summary: 'Salvar um pet na lista de favoritos' })
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
        background: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'Pet já está salvo em seus favoritos'
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
          example: 'Pet não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'petId', type: 'number', required: true })
  @Patch(':petId')
  async create(@Param() { petId }: TCreateFavorite, @Req() req: Request) {
    return await this.favoriteService.post(petId, req.user.id);
  }

  @ApiOperation({ summary: 'Remover um pet da lista de favoritos' })
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
          example: 'Favorito não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number, @Req() req: Request) {
    return await this.favoriteService.remove(id, req.user.id);
  }
}
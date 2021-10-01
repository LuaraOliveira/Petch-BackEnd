import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
@RoleDecorator('adotante')
@Controller('favorites')
export class FavoriteController {
  constructor(
    private favoriteService: FavoriteService
  ) { }

  @Get()
  async index() {
    return await this.favoriteService.get();
  }

  @ApiOperation({ summary: 'Salvar um pet na lista de favoritos' })
  @ApiOkResponse({ description: 'Success' })
  @Patch(':petId')
  async create(@Param() { petId }: TCreateFavorite, @Req() req: Request) {
    return await this.favoriteService.post(petId, req.user.id);
  }

  @ApiOperation({ summary: 'Remover um pet da lista de favoritos' })
  @ApiOkResponse({ description: 'Success' })
  @Delete(':petId')
  async remove(@Param() { petId }: TCreateFavorite, @Req() req: Request) {
    return await this.favoriteService.remove(petId, req.user.id);
  }
}
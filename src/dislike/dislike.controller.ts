import { ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { TCreateDislike } from './dislike.dto';
import { DislikeService } from './dislike.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Dislikes')
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
@Controller('dislikes')
export class DislikeController {
  constructor(
    private dislikeService: DislikeService
  ) { }

  @Get()
  async index() {
    return await this.dislikeService.get();
  }

  @ApiOperation({ summary: 'Dar dislike em um pet' })
  @ApiOkResponse({ description: 'Success' })
  @Patch(':petId')
  async create(@Param() { petId }: TCreateDislike, @Req() req: Request) {
    return await this.dislikeService.post(petId, req.user.id);
  }
}
import { ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiParam, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
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
@Controller('dislikes')
export class DislikeController {
  constructor(
    private dislikeService: DislikeService
  ) { }

  @ApiOperation({ summary: 'Dar dislike em um pet' })
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
          example: 'Pet já recebeu dislike'
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
  @ApiParam({ type: 'number', name: 'petId', required: true })
  @Patch(':petId')
  async create(@Param() { petId }: TCreateDislike, @Req() req: Request) {
    return await this.dislikeService.post(petId, req.user.id);
  }
}
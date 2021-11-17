import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiBearerAuth, ApiTags, ApiOkResponse, ApiParam, ApiQuery, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request } from 'express';

import { Scheduling, TAvailableScheduling, TCreateScheduling, TFilterScheduling, TRegisteredScheduling } from './scheduling.dto';
import { SchedulingService } from './scheduling.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Schedulings')
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
@Controller('schedulings')
export class SchedulingController {
  constructor(
    private schedulingService: SchedulingService
  ) { }

  @ApiExcludeEndpoint()
  @Get('all')
  async all() {
    return await this.schedulingService.all()
  }

  @ApiOperation({ summary: 'Visualizar todos os agendamentos' })
  @ApiOkResponse({ type: [Scheduling], description: 'Success' })
  @Get()
  async index(@Req() req: Request, @Query() query?: TFilterScheduling) {
    if (req.user.role.name === 'Adotante') return await this.schedulingService.mySchedules(req.user.id, query);
    return await this.schedulingService.get(query);
  }

  @ApiOperation({ summary: 'Visualizar datas disponíveis de agendamento' })
  @ApiOkResponse({ type: [TAvailableScheduling], description: 'Success' })
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
              example: 'Data é obrigatória'
            },
            {
              type: 'string',
              example: 'Data inválida'
            },
            {
              type: 'string',
              example: 'Impossível agendar em uma data passada'
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
          example: 'Tipo de agendamento não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'schedulingTypesId', type: 'number', required: true })
  @ApiQuery({ name: 'date', type: 'string', required: true })
  @RoleDecorator('adotante')
  @Get(':schedulingTypesId/available')
  async available(@Param('schedulingTypesId') schedulingTypesId: number, @Query('date') date: string) {
    return await this.schedulingService.availableSchedulings(schedulingTypesId, date);
  }

  @ApiOperation({ summary: 'Visualizar um agendamento pelo ID' })
  @ApiOkResponse({ type: Scheduling, description: 'Success' })
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
          example: 'Agendamento não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id')
  async byId(@Param('id') id: number, @Req() req: Request) {
    if (req.user.role.name === 'Adotante') return await this.schedulingService.findById(id, req.user.id);
    return await this.schedulingService.findById(id);
  }

  @ApiOperation({ summary: 'Cadastrar um novo agendamento' })
  @ApiCreatedResponse({ type: TRegisteredScheduling, description: 'Created' })
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
              example: 'Campo "X" é obrigatório'
            },
            {
              type: 'string',
              example: 'Você não adotou um pet para efetuar um agendamento'
            },
            {
              type: 'string',
              example: 'Data inválida'
            },
            {
              type: 'string',
              example: 'Data passada não permitida'
            },
            {
              type: 'string',
              example: 'Hora passada não permitida'
            },
            {
              type: 'string',
              example: 'Data de agendamento indisponível'
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
          example: 'Tipo de agendamento não encontrado',
        },
      }
    }
  })
  @ApiBody({ type: TCreateScheduling })
  @RoleDecorator('adotante')
  @Post()
  async create(@Req() req: Request, @Body() data: TCreateScheduling) {
    return await this.schedulingService.post(req.user, data);
  }

  @ApiOperation({ summary: 'Cancelar um agendamento marcado' })
  @ApiOkResponse({ type: TRegisteredScheduling, description: 'Success' })
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
              example: 'Você só pode cancelar uma agendamento com uma hora de antecedência'
            },
            {
              type: 'string',
              example: 'Agendamento ocorrido não pode ser cancelado'
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
          example: 'Agendamento não encontrado',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @RoleDecorator('adotante')
  @Put(':id')
  async cancelSchedule(@Req() req: Request, @Param('id') id: number) {
    return await this.schedulingService.cancelSchedule(req.user, id);
  }
}
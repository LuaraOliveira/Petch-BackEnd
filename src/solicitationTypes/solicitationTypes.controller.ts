import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SolicitationTypes } from './solicitationTypes.model';
import { SolicitationTypesService } from './solicitationTypes.service';

@ApiTags('Solicitation Types')
@Controller('solicitationTypes')
export class SolicitationTypesController {
  constructor(
    private solicitationTypesService: SolicitationTypesService
  ) { }

  @ApiOperation({ summary: 'Listar todos os tipos de solicitação' })
  @ApiOkResponse({ type: [SolicitationTypes], description: 'Success' })
  @ApiQuery({ name: 'name', enum: ['Elogios', 'Dúvidas', 'Reclamações'], required: false })
  @Get()
  async index(@Query('name') name?: string) {
    return await this.solicitationTypesService.get(name);
  }

  @ApiOperation({ summary: 'Listar um tipo de solicitação pelo ID' })
  @ApiOkResponse({ type: SolicitationTypes, description: 'Success' })
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
          example: 'Tipo de solicitação não encontrada',
        },
      }
    }
  })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async byId(@Param('id') id: number) {
    return await this.solicitationTypesService.findById(id);
  }
}

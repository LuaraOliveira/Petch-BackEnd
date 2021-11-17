import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { TPetsByGender, TPetsByOng, TPetsBySpecies, TTotalSchedulings, TTotalSolicitations } from './dashboard.dto';
import { DashboardService } from './dashboard.service';
import { RoleDecorator } from '../common/decorators/role.decorator';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Dashboard')
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
@RoleDecorator('admin')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService
  ) { }

  @ApiOperation({ summary: 'Pets por gênero' })
  @ApiOkResponse({ type: [TPetsByGender], description: 'Success' })
  @Get('/pets')
  async petsByGender() {
    return await this.dashboardService.petsByGender();
  }

  @ApiOperation({ summary: 'Pets por ONG' })
  @ApiOkResponse({ type: [TPetsByOng], description: 'Success' })
  @Get('/ongs')
  async ongsByGender() {
    return await this.dashboardService.petsByOng();
  }

  @ApiOperation({ summary: 'Total de agendamentos' })
  @ApiOkResponse({ type: [TTotalSchedulings], description: 'Success' })
  @Get('/schedulings')
  async totalSchedulings() {
    return await this.dashboardService.totalSchedulings();
  }

  @ApiOperation({ summary: 'Total de solicitações' })
  @ApiOkResponse({ type: [TTotalSolicitations], description: 'Success' })
  @Get('/solicitations')
  async totalSolicitations() {
    return await this.dashboardService.totalSolicitations();
  }

  @ApiOperation({ summary: 'Total de pets por espécie' })
  @ApiOkResponse({ type: [TPetsBySpecies], description: 'Success' })
  @Get('/species')
  async petsBySpecies() {
    return await this.dashboardService.petsBySpecies();
  }
}
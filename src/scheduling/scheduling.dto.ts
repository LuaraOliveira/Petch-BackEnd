import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

import { SchedulingTypes } from '../schedulingTypes/schedulingTypes.model';
import { User } from '../user/user.dto';

export class Scheduling {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2021-01-01T00:00:00-03:00' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsDateString({}, { message: 'Data inválida' })
  date: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false, default: null })
  @IsDate({ message: 'Data de cancelamento inválida' })
  canceledAt?: Date;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Tipo de agendamento é obrigatório' })
  @Transform(({ value }) => value.trim())
  schedulingTypesId: number;

  @ApiProperty({ type: SchedulingTypes, required: false })
  schedulingTypes: SchedulingTypes;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Usuário é obrigatório' })
  @Transform(({ value }) => value.trim())
  userId: number;

  @ApiProperty({ type: User, required: false })
  user: User;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TAvailableScheduling {
  @ApiProperty({ type: 'string', example: '00:00' })
  time: string;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2021-01-01T00:00:00-03:00' })
  value: string;

  @ApiProperty({ type: 'boolean' })
  available: boolean;

  @ApiProperty({ type: 'string', example: '00:00' })
  limitHour: string;
}

export class TCreateScheduling extends PickType(Scheduling, ['schedulingTypesId']) {
  @ApiProperty({ type: 'string', format: 'date-time', example: '2021-01-01T00:00:00-03:00' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsDateString({}, { message: 'Data inválida' })
  date: string;
}

export class TFilterScheduling {
  @ApiProperty({ type: 'number', required: false })
  schedulingTypesId?: number;

  @ApiProperty({ type: 'string', format: 'date', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Data inválida' })
  date?: string;

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  canceled?: 'true' | 'false';
}
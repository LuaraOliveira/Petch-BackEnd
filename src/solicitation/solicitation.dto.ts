import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { SolicitationTypes } from '../solicitationTypes/solicitationTypes.model';
import { User } from '../user/user.dto';

export class Solicitation {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Tipo de solicitação é obrigatória' })
  solicitationTypesId: number;

  @ApiProperty({ type: SolicitationTypes, required: false })
  solicitationType: SolicitationTypes;

  @ApiProperty({ type: 'number' })
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

export class TCreateSolicitation extends OmitType(Solicitation, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user', 'solicitationType', 'userId']) { }

export class TRegisteredSolicitation {
  @ApiProperty({ type: 'string' })
  message: string;

  @ApiProperty({ type: 'string' })
  background: string;
}
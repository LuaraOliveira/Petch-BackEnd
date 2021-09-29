import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

import { SolicitationTypes } from '../solicitationTypes/solicitationTypes.model';
import { User } from '../user/user.dto';

export class Solicitation {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Tipo de solicitação é obrigatória' })
  @Transform(({ value }) => value.trim())
  solicitationTypeId: number;

  @ApiProperty({ type: SolicitationTypes, required: false })
  solicitationType: SolicitationTypes;

  @ApiProperty({ type: 'number', required: false })
  userId?: number;

  @ApiProperty({ type: User, required: false })
  user: User;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TCreateSolicitation extends OmitType(Solicitation, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user', 'solicitationType', 'userId', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}
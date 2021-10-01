import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { Partner } from '../partner/partner.dto';

export class Gift {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Descrição é obrigatório' })
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({ type: 'string', required: false })
  size?: string;

  @ApiProperty({ type: 'string', required: false })
  color?: string;

  @ApiProperty({ type: 'string', required: false })
  weight?: string;

  @ApiProperty({ type: 'string', required: false })
  taste?: string;

  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Parceiro é obrigatório' })
  @Transform(({ value }) => value.trim())
  partnerId: number;

  @ApiProperty({ type: Partner, required: false })
  partner: Partner;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexGift extends PickType(Gift, ['id', 'name', 'description', 'image', 'deletedAt']) {
  @ApiProperty({
    type: 'object',
    properties: {
      fantasyName: {
        type: 'string'
      }
    }
  })
  partner: object;
}

export class TCreateGift extends OmitType(Gift, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image', 'partner']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}

export class TUpdateGift extends PartialType(TCreateGift) { }

export class TFilterGift {
  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';

  @ApiProperty({ type: 'string', required: false })
  name?: string;
}
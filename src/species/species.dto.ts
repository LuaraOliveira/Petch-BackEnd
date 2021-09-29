import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class Species {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'Nome da Espécie é obrigatório' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexSpecies extends OmitType(Species, ['createdAt', 'updatedAt']) { }

export class TCreateSpecies extends PickType(Species, ['name']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}

export class TUpdateSpecies extends PartialType(OmitType(Species, ['id', 'image', 'createdAt', 'updatedAt', 'deletedAt'])) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}

export class TFilterSpecies {
  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';
}
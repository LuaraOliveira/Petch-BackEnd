import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Ong } from '../ong/ong.dto';
import { Species } from '../species/species.dto';

export class Pet {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: string;

  @ApiProperty({ type: 'string', required: false })
  breed?: string;

  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Idade é obrigatória' })
  @Transform(({ value }) => value.trim())
  age: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Cor é obrigatória' })
  @Transform(({ value }) => value.trim())
  color: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Peso é obrigatório' })
  @Transform(({ value }) => value.trim())
  weight: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F'] })
  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEnum(['M', 'F'], { message: 'Gênero inválido' })
  gender: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Imagem é obrigatória' })
  @Transform(({ value }) => value.trim())
  image: string;

  @ApiProperty({ type: 'boolean', required: false, default: false })
  cut?: boolean;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'ONG é obrigatória' })
  @Transform(({ value }) => value.trim())
  ongId: number;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  @Transform(({ value }) => value.trim())
  speciesId: number;

  @ApiProperty({ type: Ong, required: false })
  ong: Ong;

  @ApiProperty({ type: Species, required: false })
  species: Species;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TCreatePet extends OmitType(Pet, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'ong', 'species', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary' })
  media: string;
}

export class TUpdatePet extends PartialType(TCreatePet) { }

export class TFilterPet {
  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  cut?: 'true' | 'false';

  @ApiProperty({ type: 'string', enum: ['M', 'F'], required: false })
  gender?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;

  @ApiProperty({ type: 'number', required: false })
  age?: number;

  @ApiProperty({ type: 'number', required: false })
  weight?: number;

  @ApiProperty({ type: 'number', required: false })
  speciesId?: number;
}
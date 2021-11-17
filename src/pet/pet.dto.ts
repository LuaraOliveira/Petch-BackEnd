import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { Gift } from '../gift/gift.dto';
import { Ong } from '../ong/ong.dto';
import { Species } from '../species/species.dto';
import { User } from '../user/user.dto';

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
  @IsEnum(['M', 'F'], { message: 'Gênero inválido' })
  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  @Transform(({ value }) => value.trim().toUpperCase())
  gender: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Imagem é obrigatória' })
  @Transform(({ value }) => value.trim())
  image: string;

  @ApiProperty({ type: 'boolean', required: false, default: false })
  cut?: boolean;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'ONG é obrigatória' })
  ongId: number;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Espécie é obrigatória' })
  speciesId: number;

  @ApiProperty({ type: 'number', required: false })
  userId: number;

  @ApiProperty({ type: 'number', required: false })
  giftId: number;

  @ApiProperty({ type: Ong, required: false })
  ong: Ong;

  @ApiProperty({ type: Species, required: false })
  species: Species;

  @ApiProperty({ type: Gift, required: false })
  gift: Gift;

  @ApiProperty({ type: User, required: false })
  user: User;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TCreatePet extends OmitType(Pet, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'ong', 'species', 'image', 'userId', 'giftId', 'user', 'gift']) {
  @ApiProperty({ type: 'string', format: 'binary' })
  media: string;
}

export class TUpdatePet extends PartialType(TCreatePet) { }

export class TFilterPet {
  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  @IsOptional()
  @IsEnum(['true', 'false'], { message: 'Busca por inativos inválida' })
  inactives?: 'true' | 'false';

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  @IsOptional()
  @IsEnum(['true', 'false'], { message: 'Busca por castrado inválida' })
  cut?: 'true' | 'false';

  @ApiProperty({ type: 'string', enum: ['M', 'F'], required: false })
  @IsOptional()
  @IsEnum(['M', 'F'], { message: 'Busca por gênero inválido' })
  gender?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;

  @ApiProperty({ type: 'string', required: false })
  age?: string;

  @ApiProperty({ type: 'string', required: false })
  weight?: string;

  @ApiProperty({ type: 'string', required: false })
  speciesId?: string;
}

export class TChooseGift {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ type: 'number' })
  giftId: number;
}

export class TRegisteredPet {
  @ApiProperty({ type: 'string' })
  message: string;

  @ApiProperty({ type: 'string' })
  background: string;
}
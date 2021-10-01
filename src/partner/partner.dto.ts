import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPostalCode, IsUrl, ValidateIf } from 'class-validator';

export class Partner {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Nome Fantasia é obrigatório' })
  @Transform(({ value }) => value.trim())
  fantasyName: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Razão Social é obrigatória' })
  @Transform(({ value }) => value.trim())
  companyName: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Transform(({ value }) => value.trim())
  cnpj: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'Inscrição Estadual é obrigatória' })
  @Transform(({ value }) => value.trim())
  stateRegistration: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Responsável é obrigatório' })
  @Transform(({ value }) => value.trim())
  responsible: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Website é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsUrl({}, { message: 'Website inválido' })
  website: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(({ value }) => value.trim().replace(/(\+55)/g, ''))
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  phone1: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @Transform(({ value }) => value.trim().replace(/(\+55)/g, ''))
  @IsPhoneNumber('BR', { message: 'Telefone 2 inválido' })
  phone2?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @Transform(({ value }) => value.trim().replace(/(\+55)/g, ''))
  @IsPhoneNumber('BR', { message: 'Telefone 3 inválido' })
  phone3?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Transform(({ value }) => value.trim().replace(/(\d{5})(\d{3})/, '$1-$2'))
  @IsPostalCode('BR', { message: 'CEP inválido' })
  cep: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @Transform(({ value }) => value.trim())
  address: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @Transform(({ value }) => value.trim())
  district: string;

  @ApiProperty({ type: 'string', required: false })
  complement?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @Transform(({ value }) => value.trim())
  city: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @Transform(({ value }) => value.trim())
  uf: string;

  @ApiProperty({ type: 'string', required: false })
  image?: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexPartner extends PickType(Partner, ['id', 'fantasyName', 'cnpj', 'email', 'phone1', 'responsible', 'image', 'deletedAt']) { }

export class TCreatePartner extends OmitType(Partner, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'image']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}

export class TUpdatePartner extends PartialType(TCreatePartner) { }

export class TFilterPartner {
  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';

  @ApiProperty({ type: 'string', required: false })
  fantasyName?: string;

  @ApiProperty({ type: 'string', required: false })
  uf?: string;
}
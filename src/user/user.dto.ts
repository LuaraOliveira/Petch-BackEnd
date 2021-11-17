import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsPostalCode, Matches, MinLength, ValidateIf } from 'class-validator';

import { Match } from '../common/pipes/match.pipe';
import { Role } from '../role/role.model';

export class User {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true, required: false })
  googleId?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ type: 'string', required: false })
  avatar?: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ type: 'boolean', default: false })
  emailVerified: boolean;

  @ApiProperty({ type: 'string', required: false })
  tokenVerificationEmail?: string;

  @ApiProperty({ type: 'string', required: false })
  hash?: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Transform(({ value }) => value.trim())
  cpf: string;

  @ApiProperty({ type: 'string' })
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Transform(({ value }) => value.trim())
  birthday: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F', 'O'] })
  @IsEnum(['M', 'F', 'O'], { message: 'Gênero inválido' })
  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  @Transform(({ value }) => value.trim().toUpperCase())
  gender: string;

  @ApiProperty({ type: 'string' })
  @IsPostalCode('BR', { message: 'CEP inválido' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Transform(({ value }) => value.trim().replace(/(\d{5})(\d{3})/, '$1-$2'))
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

  @ApiProperty({ type: 'string' })
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(({ value }) => value.trim())
  phone: string;

  @ApiProperty({ type: 'string', required: false })
  tokenResetPassword?: string;

  @ApiProperty({ type: 'string', required: false })
  tokenResetPasswordExpires?: string;

  @ApiProperty({ type: 'number' })
  roleId: number;

  @ApiProperty({ type: Role, required: false })
  role: Role;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class IndexUser extends PickType(User, ['id', 'name', 'cpf', 'email', 'avatar', 'deletedAt']) {
  @ApiProperty({
    type: 'object',
    properties: {
      name: {
        type: 'string', enum: ['Admin', 'Adotante']
      }
    }
  })
  role: Role;
}

export class TCreateUser extends OmitType(User, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'hash', 'avatar', 'tokenResetPassword', 'tokenResetPasswordExpires', 'tokenVerificationEmail', 'emailVerified', 'roleId', 'role']) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;

  password?: string;
}

export class TUpdateUser extends OmitType(PartialType(TCreateUser), ['googleId']) {
  @ApiProperty({ type: 'string', required: false })
  oldPassword?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((obj, _) => obj.oldPassword)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@#$!%+*=()?&,.:;?|])[A-Za-z\d-_@#$!%+*=()?&,.:;?|]/, { message: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' })
  @MinLength(8, { message: 'Senha precisa conter, no mínimo, 8 caracteres' })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  password?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((obj, _) => obj.password)
  @Match('password', { message: 'Nova senha e confirmação de senha não correspondem' })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword?: string;
}

export class TFilterUser {
  @ApiProperty({ type: 'string', enum: ['M', 'F', 'O'], required: false })
  gender?: string;

  @ApiProperty({ type: 'string', enum: ['Admin', 'Adotante'], required: false })
  role?: string;

  @ApiProperty({ type: 'string', enum: ['true', 'false'], required: false })
  inactives?: 'true' | 'false';
}

export class TConfirmRegister {
  @ApiProperty({ type: 'string' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  @Transform(({ value }) => value.trim())
  token: string;
}

export class TRegisteredUser {
  @ApiProperty({ type: 'string' })
  message: string;

  @ApiProperty({ type: 'string' })
  background: string;
}
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsPostalCode, IsString, Matches, MinLength, ValidateIf } from 'class-validator';

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
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', required: false })
  avatar?: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
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
  @IsString()
  cpf: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthday: string;

  @ApiProperty({ type: 'string', enum: ['M', 'F', 'O'] })
  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEnum(['M', 'F', 'O'], { message: 'Gênero inválido' })
  @IsString()
  gender: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsPostalCode('BR', { message: 'CEP inválido' })
  @IsString()
  cep: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  address: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  district: string;

  @ApiProperty({ type: 'string', required: false })
  complement?: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsString()
  city: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @Transform(({ value }) => value.trim())
  @IsString()
  uf: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  @IsString()
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

export class IndexUser extends PickType(User, ['id', 'name', 'email', 'avatar', 'deletedAt']) {
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
  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((_, value) => value)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@#$!%+*=()?&,.:;?|])[A-Za-z\d-_@#$!%+*=()?&,.:;?|]/, { message: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' })
  @MinLength(8, { message: 'Senha muito curta' })
  password: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((obj, _) => obj.password)
  @Match('password', { message: 'Senhas não correspondem' })
  confirmPassword: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  media?: string;
}

export class TUpdateUser extends OmitType(PartialType(TCreateUser), ['googleId', 'password', 'confirmPassword']) {
  @ApiProperty({ type: 'string', required: false })
  oldPassword?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((obj, _) => obj.oldPassword)
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@#$!%+*=()?&,.:;?|])[A-Za-z\d-_@#$!%+*=()?&,.:;?|]/, { message: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' })
  @MinLength(8, { message: 'Senha muito curta' })
  password?: string;

  @ApiProperty({ type: 'string', required: false })
  @ValidateIf((obj, _) => obj.password)
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @Match('password', { message: 'Nova senha e confirmação de senha não correspondem' })
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
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  @Transform(({ value }) => value.trim())
  token: string;
}
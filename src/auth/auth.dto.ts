import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

import { Match } from '../common/pipes/match.pipe';

export class TLogin {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  password: string;
}

export class TForgotPassword extends PickType(TLogin, ['email']) { }

export class TGoogleLogin {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Google ID é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  googleId: string;

  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  avatar?: string;
}

export class TResetPassword {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsString()
  token: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@#$!%/+*=()?&,.:;?|])[A-Za-z\d-_@#$!%/+*=()?&,.:;?|]/, { message: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' })
  @MinLength(8, { message: 'Senha muito curta' })
  @IsString()
  password: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @Match('password', { message: 'Nova senha e confirmação de senha não correspondem' })
  @IsString()
  confirmPassword: string;
}
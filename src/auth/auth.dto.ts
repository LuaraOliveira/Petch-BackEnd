import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

import { Match } from '../common/pipes/match.pipe';
import { User } from '../user/user.dto';

export class TLogin {
  @ApiProperty({ type: 'string' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}

export class TForgotPassword extends PickType(TLogin, ['email']) { }

export class TGoogleLogin {
  @ApiProperty({ type: 'string' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty({ message: 'Google ID é obrigatório' })
  @Transform(({ value }) => value.trim())
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
  token: string;

  @ApiProperty({ type: 'string' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ type: 'string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@#$!%/+*=()?&,.:;?|])[A-Za-z\d-_@#$!%/+*=()?&,.:;?|]/, { message: 'Senha precisa ter uma letra maiúscula, uma letra minúscula, um caractere especial e um número' })
  @MinLength(8, { message: 'Senha precisa conter, no mínimo, 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @ApiProperty({ type: 'string' })
  @Match('password', { message: 'Nova senha e confirmação de senha não correspondem' })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword: string;
}

class TUserLogin extends OmitType(User, ['createdAt', 'updatedAt', 'emailVerified', 'tokenVerificationEmail', 'tokenResetPasswordExpires', 'tokenResetPassword', 'role', 'roleId', 'hash', 'googleId']) {
  @ApiProperty({ type: 'string' })
  role: string;

  @ApiProperty({ type: 'string' })
  number: string;
}

export class TReturnLogin {
  @ApiProperty({ type: 'string' })
  token: string;

  @ApiProperty({ type: TUserLogin })
  user: TUserLogin;
}
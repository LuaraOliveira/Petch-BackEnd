import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, token, info) {
    if (!token) throw new HttpException('Não autorizado', 401);
    return token;
  }
}
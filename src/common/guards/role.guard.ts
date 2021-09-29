import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  async canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest() as Request;

    const hasRole = () => roles.find(role => role.toLowerCase() === user.role.name.toLowerCase());

    if (!hasRole()) throw new HttpException('Você não tem permissão', 403);

    return user && true;
  }
}
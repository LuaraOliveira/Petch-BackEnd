import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role
  ) { }

  async get(name?: string) {
    if (name) return await this.getByName(name);

    return await this.roleModel.findAll();
  }

  async getById(id: number) {
    const role = await this.roleModel.findByPk(id);

    if (!role) throw new HttpException("Função não encontrada", 404);

    return role;
  }

  async getByName(name: string) {
    return await this.roleModel.findOne({
      where: {
        name: name.normalize().trim()
      }
    });
  }
}

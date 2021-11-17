import { BeforeSave, Column, DataType, DefaultScope, HasMany, Model, Scopes, Table } from 'sequelize-typescript';

import { Pet } from '../pet/pet.model';
import { formatData } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Scopes(() => ({
  petsByOng: {
    attributes: ['name'],
    include: [
      {
        model: Pet,
        attributes: ['id']
      }
    ]
  }
}))
@Table({ paranoid: true })
export class Ong extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

  @Column(DataType.STRING)
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: Ong) {
      return formatData(this.getDataValue('phone1'), 'phone');
    }
  })
  phone1: string;

  @Column({
    type: DataType.STRING,
    get(this: Ong) {
      if (this.getDataValue('phone2')) return formatData(this.getDataValue('phone2'), 'phone');
    }
  })
  phone2: string;

  @Column({
    type: DataType.STRING,
    get(this: Ong) {
      if (this.getDataValue('phone3')) return formatData(this.getDataValue('phone3'), 'phone');
    }
  })
  phone3: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: Ong) {
      return formatData(this.getDataValue('cep'), 'cep');
    }
  })
  cep: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  district: string;

  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  uf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coverage: string;

  @HasMany(() => Pet)
  pets: Pet[];

  @BeforeSave
  static async formatData(ong: Ong) {
    ong.email = ong.email.toLowerCase();
    ong.coverage = ong.coverage.toUpperCase();
    ong.uf = ong.uf.toUpperCase();
    ong.cep = ong.cep.replace(/[\s-]/g, '');
    ong.phone1 = ong.phone1.replace(/(\+55)?[\s()-]/g, '');
    if (ong.phone2) ong.phone2 = ong.phone2.replace(/(\+55)?[\s()-]/g, '');
    if (ong.phone3) ong.phone3 = ong.phone3.replace(/(\+55)?[\s()-]/g, '');
  }
}
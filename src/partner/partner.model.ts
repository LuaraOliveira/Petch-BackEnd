import { BeforeSave, Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript';

import { formatData } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Partner extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fantasyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    get(this: Partner) {
      return formatData(this.getDataValue('cnpj'), 'cnpj');
    }
  })
  cnpj: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  stateRegistration: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

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
  website: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: Partner) {
      return formatData(this.getDataValue('phone1'), 'phone');
    }
  })
  phone1: string;

  @Column({
    type: DataType.STRING,
    get(this: Partner) {
      if (this.getDataValue('phone2')) return formatData(this.getDataValue('phone2'), 'phone');
    }
  })
  phone2: string;

  @Column({
    type: DataType.STRING,
    get(this: Partner) {
      if (this.getDataValue('phone3')) return formatData(this.getDataValue('phone3'), 'phone');
    }
  })
  phone3: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: Partner) {
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

  @Column(DataType.STRING)
  image: string;

  @BeforeSave
  static async formatData(partner: Partner) {
    partner.email = partner.email.toLowerCase();
    partner.uf = partner.uf.toUpperCase();
    partner.cep = partner.cep.replace(/[\s-]/g, '');
    partner.stateRegistration = partner.stateRegistration.replace(/[\s.]/g, '');
    partner.cnpj = partner.cnpj.replace(/[\/\s-.]/g, '');
    partner.phone1 = partner.phone1.replace(/[\s()-]/g, '');
    if (partner.phone2) partner.phone2 = partner.phone2.replace(/[\s()-]/g, '');
    if (partner.phone3) partner.phone3 = partner.phone3.replace(/[\s()-]/g, '');
    if (!partner.website.includes('https://')) partner.website = `https://${partner.website}`;
  }
}
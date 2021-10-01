import { AfterSync, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Partner } from '../partner/partner.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  include: [
    {
      model: Partner,
      attributes: ['fantasyName'],
      paranoid: true,
    }
  ],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Gift extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column(DataType.STRING)
  size: string;

  @Column(DataType.STRING)
  color: string;

  @Column(DataType.STRING)
  weight: string;

  @Column(DataType.STRING)
  taste: string;

  @Column(DataType.STRING)
  image: string;

  @ForeignKey(() => Partner)
  @Column({ allowNull: false })
  partnerId: number;

  @BelongsTo(() => Partner)
  partner: Partner;

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        id: 1,
        partnerId: 1,
        name: 'Coleira',
        description: 'Coleira preta, simples de usar, que não machuca o seu pet',
        color: 'Preto',
        size: 'P',
        image: 'https://images.unsplash.com/photo-1620954492246-f1f107f4ec89?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGxlYXNofGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 2,
        partnerId: 3,
        name: 'Petisco',
        description: 'Um delicioso petisco para seu pet, excelente para fortalecer ossos',
        weight: '1kg',
        taste: 'churrasco',
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c25hY2slMjBkb2d8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 3,
        partnerId: 2,
        name: 'Cama',
        description: 'Uma caminha aconchegante para seu amigo',
        color: 'rosa',
        size: 'G',
        image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y291cG9ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
    ], { ignoreDuplicates: true });
  }

  @BeforeSave
  static async formatData(gift: Gift) {
    gift.name = capitalizeFirstLetter(gift.name);
    gift.description = capitalizeFirstLetter(gift.description);
    if (gift.size) gift.size = gift.size.toUpperCase();
    if (gift.weight) gift.weight = gift.weight.toLowerCase();
    if (gift.color) gift.color = capitalizeFirstLetter(gift.color);
    if (gift.taste) gift.taste = capitalizeFirstLetter(gift.taste);
  }
}
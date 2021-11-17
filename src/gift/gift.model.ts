import { BeforeSave, Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript';

import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Gift extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  
  @Column(DataType.STRING)
  image: string;

  @BeforeSave
  static async formatData(gift: Gift) {
    gift.name = capitalizeFirstLetter(gift.name);
  }
}
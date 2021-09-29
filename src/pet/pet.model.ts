import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Ong } from '../ong/ong.model';
import { Species } from '../species/species.model';
import { User } from '../user/user.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  include: [
    {
      model: Species,
      attributes: ['name']
    }
  ]
}))
@Table({ paranoid: true })
export class Pet extends Model {
  @Column(DataType.STRING)
  breed: string;

  @Column(DataType.STRING)
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  age: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  weight: string;

  @Column({
    type: DataType.ENUM('M', 'F'),
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  cut: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Ong)
  @Column({ allowNull: false })
  ongId: number;

  @ForeignKey(() => Species)
  @Column({ allowNull: false })
  speciesId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Ong)
  ong: Ong;

  @BelongsTo(() => Species)
  species: Species;

  @BeforeSave
  static async formatData(pet: Pet) {
    pet.gender = pet.gender.toUpperCase();
    pet.age = pet.age.toLowerCase();
    pet.color = capitalizeFirstLetter(pet.color);
    pet.description = capitalizeFirstLetter(pet.description);
    if (pet.name) pet.name = capitalizeFirstLetter(pet.name);
    if (pet.breed) pet.breed = capitalizeFirstLetter(pet.breed);
  }
}
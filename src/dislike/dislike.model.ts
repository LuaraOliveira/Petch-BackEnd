import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Pet } from '../pet/pet.model';
import { User } from '../user/user.model';

@Table({ paranoid: true })
export class Dislike extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @ForeignKey(() => Pet)
  @Column({ allowNull: false })
  petId: number;

  @BelongsTo(() => Pet)
  pet: Pet[];
}
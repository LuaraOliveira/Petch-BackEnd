import { BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { SchedulingTypes } from '../schedulingTypes/schedulingTypes.model';
import { User } from '../user/user.model';

@DefaultScope(() => ({
  // include: [User, SchedulingTypes],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Scheduling extends Model {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: null,
  })
  canceledAt: Date;

  @ForeignKey(() => SchedulingTypes)
  @Column({ allowNull: false })
  schedulingTypesId: number;

  @BelongsTo(() => SchedulingTypes)
  schedulingTypes: SchedulingTypes;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
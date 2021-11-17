import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Scopes, Table } from 'sequelize-typescript';

import { Scheduling } from '../scheduling/scheduling.model';

@Scopes(() => ({
  dash: {
    attributes: ['id', 'name'],
    include: [
      {
        model: Scheduling,
        attributes: ['id', 'schedulingTypesId']
      }
    ]
  }
}))
@Table({ paranoid: true })
export class SchedulingTypes extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @HasMany(() => Scheduling)
  schedulings: Scheduling[];
}
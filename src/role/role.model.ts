import { ApiProperty } from '@nestjs/swagger';
import { AfterSync, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Role extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      { id: 1, name: "Admin" },
      { id: 2, name: "Adotante" },
    ], { ignoreDuplicates: true });
  }
}
import { compare, hash } from 'bcrypt';
import { format, parseISO } from 'date-fns';
import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, HasMany, Model, Scopes, Table } from 'sequelize-typescript';

import { Dislike } from '../dislike/dislike.model';
import { Favorite } from '../favorite/favorite.model';
import { Pet } from '../pet/pet.model';
import { Role } from '../role/role.model';
import { formatData } from '../utils';

@DefaultScope(() => ({
  include: [
    {
      model: Role,
      attributes: ['name']
    }
  ],
  order: [['id', 'asc']]
}))
@Scopes(() => ({
  withPet: {
    attributes: ['id'],
    include: [
      {
        model: Pet,
        attributes: ['id']
      }
    ],
  }
}))
@Table({ paranoid: true })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    defaultValue: null
  })
  googleId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING)
  avatar: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column(DataType.STRING)
  tokenVerificationEmail: string;

  @Column(DataType.STRING)
  hash: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    get(this: User) {
      return formatData(this.getDataValue('cpf'), 'cpf');
    }
  })
  cpf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  birthday: string;

  @Column({
    type: DataType.ENUM('M', 'F', 'O'),
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: User) {
      return formatData(this.getDataValue('cep'), 'cep');
    }
  })
  cep: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uf: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    get(this: User) {
      return formatData(this.getDataValue('phone'), 'phone');
    }
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPassword: string;

  @Column({
    type: DataType.DATE,
    defaultValue: null
  })
  tokenResetPasswordExpires: Date;

  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Dislike)
  dislike: Dislike[];

  @HasMany(() => Favorite)
  favorite: Favorite[];

  @HasMany(() => Pet)
  pets: Pet[];

  @BeforeSave
  static async formatData(user: User) {
    user.email = user.email.toLowerCase();
    user.birthday = format(parseISO(user.birthday), 'yyyy-MM-dd');
    user.uf = user.uf.toUpperCase();
    user.gender = user.gender.toUpperCase();
    user.cpf = user.cpf.replace(/[\s.-]/g, '');
    user.cep = user.cep.replace(/[\s-]/g, '');
    user.phone = user.phone.replace(/(55)?[\s-+()]/g, '');
    if (user.password) user.hash = await hash(user.password, 10);
  }

  checkPass(password: string) {
    return compare(password, this.hash);
  }
}
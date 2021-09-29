import { AfterSync, BeforeSave, Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Ong extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

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
    allowNull: false
  })
  phone1: string;

  @Column(DataType.STRING)
  phone2: string;

  @Column(DataType.STRING)
  phone3: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
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

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        id: 1,
        name: 'Dogs do Coração',
        email: 'doguineos@dogscore.com',
        image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9nJTIwaGVhcnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        phone1: '1128169333',
        phone2: '11985856127',
        cep: '05850245',
        address: 'Rua Francisco Soares de Farias, 939',
        district: 'Parque Santo Antônio',
        city: 'São Paulo',
        uf: 'SP',
        coverage: 'SP, RJ, MG, ES',
        responsible: 'Raimunda Renata Brito'
      },
      {
        id: 2,
        name: 'Pet Place',
        email: 'place@petplace.com.br',
        image: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGV0JTIwcGxhY3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        phone1: '4829542922',
        phone2: '48995972859',
        cep: '88106692',
        address: 'Rua Salvador Silva Porto, 838',
        district: 'Forquilhinha',
        city: 'São José',
        uf: 'SC',
        coverage: 'SC, PR, SP',
        responsible: 'Jaqueline Aparecida Pereira'
      },
      {
        id: 3,
        name: 'ONG Melhor Amigo',
        email: 'OMA@melhoramigo.com.br',
        image: 'https://images.unsplash.com/photo-1607163365613-c281acde5012?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGV0JTIwZnJpZW5kfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        phone1: '8827492520',
        phone2: '88994753142',
        phone3: '8825555591',
        cep: '62030705',
        address: 'Rua Pricesa do Norte, 904',
        district: 'Cidade Pedro Mendes Carneiro',
        city: 'Sobral',
        uf: 'CE',
        coverage: 'CE, PE',
        responsible: 'Francisco Davi Diogo de Paula'
      },
    ], { ignoreDuplicates: true });
  }

  @BeforeSave
  static async formatData(ong: Ong) {
    ong.email = ong.email.toLowerCase();
    ong.coverage = ong.coverage.toUpperCase();
    ong.uf = ong.uf.toUpperCase();
    ong.cep = ong.cep.replace(/[\s-]/g, '');
    ong.phone1 = ong.phone1.replace(/(55)?[\s-+()]/g, '');
    if (ong.phone2) ong.phone2 = ong.phone2.replace(/(55)?[\s-+()]/g, '');
    if (ong.phone3) ong.phone3 = ong.phone3.replace(/(55)?[\s-+()]/g, '');
  }
}
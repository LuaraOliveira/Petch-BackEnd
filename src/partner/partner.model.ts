import { AfterSync, BeforeSave, Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript';

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
    unique: true
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

  @Column(DataType.STRING)
  image: string;

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        id: 1,
        fantasyName: 'Petz',
        companyName: 'Petz Com. e Ind. de Produtos LTDA.',
        cnpj: '05875578000105',
        stateRegistration: '987178808780',
        responsible: 'João Osvaldo Lima',
        email: 'financeiro@petzltda.com.br',
        website: 'https://petz.com.br',
        phone1: '1138376789',
        phone2: '11988525083',
        cep: '04298090',
        address: 'Rua Bertolina Maria, 561',
        district: 'Vila Vermelha',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1150&q=80'
      },
      {
        id: 2,
        fantasyName: 'Photografia Sublime',
        companyName: 'Photografia Sublime ME',
        cnpj: '69334805000178',
        stateRegistration: '752415244087',
        responsible: 'Eliane Fátima Cavalcanti',
        email: 'photo@sublime.com.br',
        website: 'https://photografiasublime.com.br',
        phone1: '1728728306',
        phone2: '17997510090',
        phone3: '17997519955',
        cep: '15810476',
        address: 'Rua Caldas Novas, 885',
        district: 'Loteamento Cidade Jardim',
        city: 'Catanduva',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1484239398315-f1681ef72fe6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
      },
      {
        id: 3,
        fantasyName: 'Focinhos e Patas',
        companyName: 'Focinhos e Patas Com. de Produtos LTDA.',
        cnpj: '74010830000136',
        stateRegistration: '175559121958',
        responsible: 'Jorge Kaique das Neves',
        email: 'vendas@focinhospatas.com.br',
        website: 'https://focinhospatas.com.br',
        phone1: '1138224867',
        cep: '05568010',
        address: 'Rua Severiano Leite da Silva, 233',
        district: 'Jardim São Jorge',
        complement: '15 andar',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGF3fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        id: 4,
        fantasyName: 'PetPlace',
        companyName: 'PetPlace Produtos Licenciados LTDA.',
        cnpj: '25759326000128',
        stateRegistration: '635503786',
        responsible: 'Francisco Gael das Neves',
        email: 'comunicacoes@petplace.com.br',
        website: 'https://petplace.com.br',
        phone1: '4829027084',
        phone2: '48982086019',
        cep: '88706-203',
        address: 'Rua Santilino Antônio de Medeiros, 768',
        district: 'Passo do Gado',
        city: 'Tubarão',
        uf: 'SC',
        image: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ], { ignoreDuplicates: true });
  }

  @BeforeSave
  static async formatData(partner: Partner) {
    partner.email = partner.email.toLowerCase();
    partner.uf = partner.uf.toUpperCase();
    partner.cep = partner.cep.replace(/[\s-]/g, '');
    partner.stateRegistration = partner.stateRegistration.replace(/[\s.]/g, '');
    partner.cnpj = partner.cnpj.replace(/[\/\s-.]/g, '');
    partner.phone1 = partner.phone1.replace(/(55)?[\s-+()]/g, '');
    if (partner.phone2) partner.phone2 = partner.phone2.replace(/(55)?[\s-+()]/g, '');
    if (partner.phone3) partner.phone3 = partner.phone3.replace(/(55)?[\s-+()]/g, '');
    if (!partner.website.includes('https://')) partner.website = `https://${partner.website}`;
  }
}
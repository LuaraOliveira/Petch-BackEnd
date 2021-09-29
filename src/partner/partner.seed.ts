import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Partner } from './partner.model';

@Seeder({
  model: Partner,
  runOnlyIfTableIsEmpty: true,
  unique: ['cnpj', 'stateRegistration', 'email']
})
export class PartnerSeed implements OnSeederInit {
  run() {
    return [
      {
        fantasyName: 'Petz',
        companyName: 'Petz Com. e Ind. de Produtos LTDA.',
        cnpj: '05.875.578/0001-05',
        stateRegistration: '987.178.808.780',
        responsible: 'João Osvaldo Lima',
        email: 'financeiro@petzltda.com.br',
        website: 'https://petz.com.br',
        phone1: '(11) 3837-6789',
        phone2: '(11) 98852-5083',
        cep: '04298-090',
        address: 'Rua Bertolina Maria, 561',
        district: 'Vila Vermelha',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1150&q=80'
      },
      {
        fantasyName: 'Photografia Sublime',
        companyName: 'Photografia Sublime ME',
        cnpj: '69.334.805/0001-78',
        stateRegistration: '752.415.244.087',
        responsible: 'Eliane Fátima Cavalcanti',
        email: 'photo@sublime.com.br',
        website: 'https://photografiasublime.com.br',
        phone1: '(17) 2872-8306',
        phone2: '(17) 99751-0090',
        phone3: '(17) 99751-9955',
        cep: '15810-476',
        address: 'Rua Caldas Novas, 885',
        district: 'Loteamento Cidade Jardim',
        city: 'Catanduva',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1484239398315-f1681ef72fe6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
      },
      {
        fantasyName: 'Focinhos e Patas',
        companyName: 'Focinhos e Patas Com. de Produtos LTDA.',
        cnpj: '74.010.830/0001-36',
        stateRegistration: '175.559.121.958',
        responsible: 'Jorge Kaique das Neves',
        email: 'vendas@focinhospatas.com.br',
        website: 'https://focinhospatas.com.br',
        phone1: '(11) 3822-4867',
        cep: '05568-010',
        address: 'Rua Severiano Leite da Silva, 233',
        district: 'Jardim São Jorge',
        complement: '15 andar',
        city: 'São Paulo',
        uf: 'SP',
        image: 'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGF3fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        fantasyName: 'PetPlace',
        companyName: 'PetPlace Produtos Licenciados LTDA.',
        cnpj: '25.759.326/0001-28',
        stateRegistration: '635.503.786',
        responsible: 'Francisco Gael das Neves',
        email: 'comunicacoes@petplace.com.br',
        website: 'https://petplace.com.br',
        phone1: '(48) 2902-7084',
        phone2: '(48) 98208-6019',
        cep: '88706-203',
        address: 'Rua Santilino Antônio de Medeiros, 768',
        district: 'Passo do Gado',
        city: 'Tubarão',
        uf: 'SC',
        image: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ];
  }
}
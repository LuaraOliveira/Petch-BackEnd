import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Ong } from './ong.model';

@Seeder({
  model: Ong,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class OngSeed implements OnSeederInit {
  run() {
    return [
      {
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
    ];
  }
}
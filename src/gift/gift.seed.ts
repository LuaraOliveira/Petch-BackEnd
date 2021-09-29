import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Gift } from './gift.model';

@Seeder({
  model: Gift,
  runOnlyIfTableIsEmpty: true,
  containsForeignKeys: true
})
export class GiftSeed implements OnSeederInit {
  run() {
    return [
      {
        partnerId: 1,
        name: 'Coleira',
        description: 'Coleira preta, simples de usar, que não machuca o seu pet',
        color: 'Preto',
        size: 'P',
        image: 'https://images.unsplash.com/photo-1620954492246-f1f107f4ec89?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGxlYXNofGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        partnerId: 4,
        name: 'Petisco',
        description: 'Um delicioso petisco para seu pet, excelente para fortalecer ossos',
        weight: '1kg',
        taste: 'churrasco',
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c25hY2slMjBkb2d8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
      {
        partnerId: 2,
        name: 'Cama',
        description: 'Uma caminha aconchegante para seu amigo',
        color: 'rosa',
        size: 'G',
        image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y291cG9ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      },
    ];
  }
}
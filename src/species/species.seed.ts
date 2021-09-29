import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Species } from './species.model';

@Seeder({
  model: Species,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class SpeciesSeed implements OnSeederInit {
  run() {
    return [
      {
        name: "Cachorro",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
      {
        name: "Gato",
        image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      },
    ];
  }
}
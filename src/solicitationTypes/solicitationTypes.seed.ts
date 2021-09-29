import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { SolicitationTypes } from './solicitationTypes.model';

@Seeder({
  model: SolicitationTypes,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class SolicitationTypesSeed implements OnSeederInit {
  run() {
    return [
      { name: "Elogio" },
      { name: "Reclamação" },
      { name: "Dúvida" },
    ];
  }
}
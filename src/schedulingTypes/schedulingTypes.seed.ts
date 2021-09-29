import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { SchedulingTypes } from './schedulingTypes.model';

@Seeder({
  model: SchedulingTypes,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class SchedulingTypesSeed implements OnSeederInit {
  run() {
    return [
      { name: "Vacina" },
      { name: "Banho" },
      { name: "Medicação" },
    ];
  }
}
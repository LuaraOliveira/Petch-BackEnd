import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Role } from './role.model';

@Seeder({
  model: Role,
  runOnlyIfTableIsEmpty: true,
  unique: 'name'
})
export class RoleSeed implements OnSeederInit {
  run() {
    return [
      { name: "Admin" },
      { name: "Adotante" },
    ];
  }
}
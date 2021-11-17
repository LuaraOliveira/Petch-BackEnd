import { ApiProperty } from '@nestjs/swagger';

export class TPetsByOng {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'number' })
  quantity: number;
}

export class TPetsByGender extends TPetsByOng { }
export class TTotalSchedulings extends TPetsByOng { }
export class TTotalSolicitations extends TPetsByOng { }
export class TPetsBySpecies extends TPetsByOng { }
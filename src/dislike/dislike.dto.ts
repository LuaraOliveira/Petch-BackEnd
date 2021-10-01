import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Dislike {
  @ApiProperty({ type: 'integer', uniqueItems: true, readOnly: true })
  id: number;

  @ApiProperty({ type: 'integer' })
  @IsNotEmpty({ message: 'Usuário é obrigatório' })
  userId: number;

  @ApiProperty({ type: 'integer' })
  @IsNotEmpty({ message: 'Pet é obrigatório' })
  petId: number;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}

export class TCreateDislike extends PickType(Dislike, ['petId']) { }
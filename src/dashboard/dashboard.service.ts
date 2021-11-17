import { Injectable } from '@nestjs/common';
import { format, getMonth, parseISO, setMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SpeciesService } from 'src/species/species.service';

import { OngService } from '../ong/ong.service';
import { PetService } from '../pet/pet.service';
import { SchedulingTypesService } from '../schedulingTypes/schedulingTypes.service';
import { SolicitationTypesService } from '../solicitationTypes/solicitationTypes.service';
import { capitalizeFirstLetter } from '../utils';

@Injectable()
export class DashboardService {
  constructor(
    private ongService: OngService,
    private petService: PetService,
    private schedulingTypesService: SchedulingTypesService,
    private solicitationTypeService: SolicitationTypesService,
    private speciesService: SpeciesService,
  ) { }

  async petsByGender() {
    const pets = await this.petService.petsByGender();

    const males = pets.filter(pet => pet.gender === 'M').length;
    const females = pets.filter(pet => pet.gender === 'F').length;

    return [
      {
        name: "Macho",
        quantity: males
      },
      {
        name: "Fêmea",
        quantity: females
      },
    ];
  }

  async petsByOng() {
    const ongs = await this.ongService.petsByOng();

    return ongs.map(ong => {
      return {
        name: ong.name,
        quantity: ong.pets.length
      };
    });
  }

  async totalSchedulings() {
    const types = await this.schedulingTypesService.dash();

    return types.map(schedule => {
      return {
        name: schedule.name,
        quantity: schedule.schedulings.filter(sch => sch.schedulingTypesId === schedule.id).length
      };
    });
  }

  async totalSolicitations() {
    const solicitationTypes = await this.solicitationTypeService.dash();

    return solicitationTypes.map(type => {
      return {
        name: type.name,
        quantity: type.solicitations.filter(solicitation => solicitation.solicitationTypesId === type.id).length
      };
    });
  }

  async petsBySpecies() {
    const species = await this.speciesService.dash();

    return species.map(specie => {
      return {
        name: specie.name,
        quantity: specie.pets.filter(pet => pet.speciesId === specie.id).length
      };
    });
  }
}
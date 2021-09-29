import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { Solicitation } from './solicitation.model';

@Seeder({
  model: Solicitation,
  runOnlyIfTableIsEmpty: true,
  containsForeignKeys: true,
  foreignDelay: 5000
})
export class SolicitationSeed implements OnSeederInit {
  run() {
    return [
      {
        userId: 5,
        description: 'Pellentesque accumsan justo at blandit interdum. Nulla consequat, quam at molestie cursus, justo ipsum mollis lorem, convallis convallis arcu erat vitae orc.',
        solicitationTypeId: 1,
      },
      {
        userId: 2,
        description: 'Morbi porta, purus eu blandit ornare, eros lorem varius nibh, posuere vehicula diam neque et diam. Praesent euismod orci quis ipsum ultricies, et molestie magna convallis.',
        solicitationTypeId: 3,
      },
      {
        name: 'Gabriel Mateus Oliveira',
        email: 'gabrielmateusoliveira__gabrielmateusoliveira@eanac.com.br',
        description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
        solicitationTypeId: 1,
      },
      {
        name: 'Mateus Ruan Sebastião Lopes',
        email: 'mmateusruansebastiaolopes@yhaoo.com.br',
        description: 'Curabitur egestas turpis vitae est pharetra, sed feugiat ante vulputate. Maecenas ultricies dolor sit amet elit ultrices euismod. Suspendisse in magna magna. Praesent lobortis dolor dictum efficitur luctus. Maecenas dignissim eu elit quis elementum.',
        solicitationTypeId: 3,
      },
      {
        name: 'Alana Carolina Campos',
        email: 'alanacarolinacampos..alanacarolinacampos@henrimar.com.br',
        description: 'Morbi porta, purus eu blandit ornare, eros lorem varius nibh, posuere vehicula diam neque et diam. Praesent euismod orci quis ipsum ultricies, et molestie magna convallis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam fermentum lacus quis euismod egestas. Nam nec lectus facilisis tortor elementum euismod. Nullam sed semper est, et aliquet eros. Pellentesque malesuada eros ut enim dignissim luctus.',
        solicitationTypeId: 2,
      },
      {
        name: 'Marlene Nair Giovana da Conceição',
        email: 'mmarlenenairgiovanadaconceicao@purkyt.com',
        description: 'Sed eget ex nec orci convallis placerat. Curabitur sit amet nibh sit amet tortor fermentum interdum. Nunc vulputate elementum efficitur.',
        solicitationTypeId: 3,
      },
      {
        name: 'Augusto Otávio Yuri Silva',
        email: 'aaugustootavioyurisilva@valeparaibano.com.br',
        description: 'Pellentesque consectetur diam ac felis rhoncus, ut mattis risus imperdiet. Proin non neque ac massa scelerisque pretium eu aliquet quam.',
        solicitationTypeId: 1,
      },
      {
        name: 'Vinicius Raimundo das Neves',
        email: 'viniciusraimundodasneves_@seal.com.br',
        description: 'Duis gravida lacinia nibh eget rutrum. Morbi a varius nunc.',
        solicitationTypeId: 2,
      },
      {
        name: 'Rosa Alessandra Larissa Rodrigues',
        email: 'rosaalessandralarissarodrigues..rosaalessandralarissarodrigues@uninorte.com.br',
        description: 'Sed id augue non magna luctus interdum sed sed arcu.',
        solicitationTypeId: 3,
      },
    ];
  }
}
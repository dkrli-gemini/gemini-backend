import { Body, Controller, Param, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddVolumeInputDto } from './dtos/add-volume.input.dto';
import { AddVolumeOutputDto } from './dtos/add-volume.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { IAddVolume } from 'src/domain/contracts/use-cases/instance/add-volume';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { throwsException } from 'src/utilities/exception';

@Controller('machines')
export class AddVolumeController
  implements IController<AddVolumeInputDto, AddVolumeOutputDto>
{
  constructor(
    private readonly addVolume: IAddVolume,
    private readonly prisma: PrismaService,
  ) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('/add-volume/:machineId')
  async handle(
    @Body() input: AddVolumeInputDto,
    req: Request,
    @Param('machineId') machineId?: string,
  ): Promise<IHttpResponse<AddVolumeOutputDto | Error>> {
    if (!machineId) {
      throwsException(new InvalidParamError('machineId é obrigatório.'));
    }

    const machine = await this.prisma.virtualMachineModel.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throwsException(new InvalidParamError('Máquina não encontrada.'));
    }

    const volume = await this.addVolume.execute({
      projectId: machine.projectId,
      name: input.name,
      machineId: machineId,
      offerId: input.offerId,
      sizeInGb: input.sizeInGb,
    });

    return created(new AddVolumeOutputDto(volume.volumeId));
  }
}

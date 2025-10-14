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
    const machine = await this.prisma.virtualMachineModel.findUnique({
      where: { id: machineId },
    });

    const volume = await this.addVolume.execute({
      projectId: machine.projectId,
      name: input.name,
      machineId: machineId,
      offerId: input.offerId,
    });

    return created(new AddVolumeOutputDto(volume.volumeId));
  }
}

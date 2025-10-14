import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListVolumesInputDto } from './dtos/list-volumes.input.dto';
import { ListVolumesOutputDto } from './dtos/list-volumes.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IVolumeRepository } from 'src/domain/repository/volume.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('machines')
export class ListVolumesController
  implements IController<ListVolumesInputDto, ListVolumesOutputDto>
{
  constructor(private readonly volumeRepository: IVolumeRepository) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('/list-volumes/:machineId')
  async handle(
    _input: ListVolumesInputDto,
    _req: Request,
    @Param('machineId') machineId?: string,
  ): Promise<IHttpResponse<ListVolumesOutputDto | Error>> {
    const volumes = await this.volumeRepository.listVolumesByMachine(machineId);
    console.log(volumes);

    return ok(new ListVolumesOutputDto(volumes));
  }
}

import { Body, Controller, Param, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddVolumeInputDto } from './dtos/add-volume.input.dto';
import { AddVolumeOutputDto } from './dtos/add-volume.output.dto';
import { Request } from 'express';
import { IHttpResponse } from 'src/domain/contracts/http';
import { IAddVolume } from 'src/domain/contracts/use-cases/instance/add-volume';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('machines')
export class AddVolumeController
  implements IController<AddVolumeInputDto, AddVolumeOutputDto>
{
  constructor(private readonly addVolume: IAddVolume) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('/add-volume/:projectId')
  async handle(
    @Body() input: AddVolumeInputDto,
    req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<AddVolumeOutputDto | Error>> {
    const volume = await this.addVolume.execute({
      projectId,
      name: 'Volume2',
      machineId: '39a3e9e4-5cbb-4352-96d9-17abf4074b2e',
      offerId: '3c492f4a-5fe1-40db-a393-3156bd6dbed7',
    });

    return null;
  }
}

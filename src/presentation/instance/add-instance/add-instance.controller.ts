/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { AddInstanceInputDto } from './dtos/add-instance.input.dto';
import { AddInstanceOutputDto } from './dtos/add-instance.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('instances')
export class AddInstanceController
  implements IController<AddInstanceInputDto, AddInstanceOutputDto>
{
  constructor(private readonly instanceRepository: IInstanceRepository) {}

  @Post('add-instance')
  @AuthorizedTo(RolesEnum.ADMIN)
  async handle(
    @Body() input: AddInstanceInputDto,
    _req: Request,
    _projectId?: string,
  ): Promise<IHttpResponse<AddInstanceOutputDto | Error>> {
    await this.instanceRepository.createInstance({
      cloudstackId: input.cloudstackId,
      cpu: input.cpu,
      name: input.name,
      memory: input.memory,
      disk: input.disk,
    });

    return ok(new AddInstanceOutputDto());
  }
}

import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { CreateRootDomainInputDto } from './dtos/create-root-domain.input.dto';
import { CreateRootDomainOutputDto } from './dtos/create-root-domain.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { ICreateRootDomain } from 'src/domain/contracts/use-cases/domain/create-root-domain';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('domain')
export class CreateRootDomainController
  implements IController<CreateRootDomainInputDto, CreateRootDomainOutputDto>
{
  constructor(private readonly useCase: ICreateRootDomain) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Post('create-root-domain')
  async handle(
    @Body() input: CreateRootDomainInputDto,
    @Req()
    req: Request,
    projectId?: string,
  ): Promise<IHttpResponse<CreateRootDomainOutputDto | Error>> {
    const response = await this.useCase.execute({
      accountEmail: input.accountEmail,
      accountPassword: input.accountPassword,
      ownerId: input.ownerId,
    });

    const result = new CreateRootDomainOutputDto(response);
    return created(result);
  }
}

import { Body, Controller, Param, Post } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { CreateForwardRuleInputDto } from './dtos/create-forward-rule.input.dto';
import { CreateForwardRuleOutputDto } from './dtos/create-forward-rule.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { ICreateForwardRule } from 'src/domain/contracts/create-forward-rule';

@Controller('vpcs')
export class CreateForwardRuleController
  implements IController<CreateForwardRuleInputDto, CreateForwardRuleOutputDto>
{
  constructor(private readonly useCase: ICreateForwardRule) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Post('/create-forward-rule/:projectId')
  async handle(
    @Body() input: CreateForwardRuleInputDto,
    _req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<CreateForwardRuleOutputDto | Error>> {
    const {
      address,
      machineId,
      privateEnd,
      privateStart,
      protocol,
      publicEnd,
      publicIpId,
      publicStart,
    } = input;

    await this.useCase.execute({
      address,
      machineId,
      privateEnd,
      privateStart,
      protocol,
      publicEnd,
      publicIpId,
      publicStart,
      projectId,
    });

    return ok(new CreateForwardRuleOutputDto(true));
  }
}

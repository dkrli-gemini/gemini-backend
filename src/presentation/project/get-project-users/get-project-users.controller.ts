import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleModel } from '@prisma/client';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IGetProjectUsers } from 'src/domain/contracts/use-cases/project/get-project-users';
import { IProjectUser } from 'src/domain/entities/project-user';
import { Secured } from 'src/infra/auth/auth.decorator';
import { UserRoles } from 'src/infra/roles/roles.decorator';
import { GetProjectUsersOutputDto } from './dtos/get-project-users-output.dto';

@Controller('projects')
@ApiTags('projects')
export class GetProjectUsersController
  implements IController<null, GetProjectUsersOutputDto>
{
  constructor(private readonly useCase: IGetProjectUsers) {}

  @Get('get-project-users/:id')
  @Secured()
  @UserRoles(RoleModel.OWNER, RoleModel.ADMIN)
  async handle(
    input: null,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('id') projectId?: string,
  ): Promise<IHttpResponse<GetProjectUsersOutputDto | Error>> {
    const projectUsers = await this.useCase.execute({ projectId: projectId });
    const response = this.mapToOutput(projectUsers);

    return ok(response);
  }

  private mapToOutput(projectUsers: IProjectUser[]): GetProjectUsersOutputDto {
    return new GetProjectUsersOutputDto(projectUsers);
  }
}

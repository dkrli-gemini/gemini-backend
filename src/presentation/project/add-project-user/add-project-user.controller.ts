import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { RoleModel } from '@prisma/client';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { IAddProjectUser } from 'src/domain/contracts/use-cases/project/add-project-user';
import { IProjectUser } from 'src/domain/entities/project-user';
import { Secured } from 'src/infra/auth/auth.decorator';
import { UserRoles } from 'src/infra/roles/roles.decorator';
import { Validator } from 'src/utilities/validator';
import { AddProjectUserInputDto } from './dtos/add-project-user-input.dto';
import { AddProjectUserOutputDto } from './dtos/add-project-user-output.dto';

@Controller('projects')
export class AddProjectUserController
  implements IController<AddProjectUserInputDto, AddProjectUserOutputDto>
{
  constructor(private readonly useCase: IAddProjectUser) {}

  @Post('add-project-user/:id')
  @Secured()
  @UserRoles(RoleModel.OWNER, RoleModel.ADMIN)
  async handle(
    @Body() input: AddProjectUserInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    @Param('id') projectId: string,
  ): Promise<IHttpResponse<AddProjectUserOutputDto | Error>> {
    this.validate(input, projectId);

    const projectUser = await this.useCase.execute({
      projectId: projectId,
      role: input.role,
      userId: input.userId,
    });

    const response = this.mapToOutput(projectUser);
    return created(response);
  }

  private validate(input: AddProjectUserInputDto, projectId: string) {
    Validator.expect(projectId).toBeString();
    Validator.expect(input).toBeNotNull();
  }

  private mapToOutput(projectUser: IProjectUser): AddProjectUserOutputDto {
    return new AddProjectUserOutputDto(projectUser);
  }
}

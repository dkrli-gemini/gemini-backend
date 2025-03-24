import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { ICreateUser } from 'src/domain/contracts/use-cases/user/create-user';
import { IUser } from 'src/domain/entities/user';
import { KeycloakAuthGuard } from 'src/infra/auth/keycloak.guard';
import { Roles, RolesGuard } from 'src/infra/auth/roles.guard';
import { CreateUserAdminInputDto } from './dtos/create-user-admin.input.dto';
import { CreateUserAdminOutputDto } from './dtos/create-user-admin.output.dto';

@UseGuards(KeycloakAuthGuard, RolesGuard)
@Controller('users')
@ApiTags('user')
export class CreateUserAdminController
  implements IController<CreateUserAdminInputDto, CreateUserAdminOutputDto>
{
  constructor(private readonly createUser: ICreateUser) {}

  @Roles('admin')
  @Post('create-user-admin')
  async handle(
    @Body() input: CreateUserAdminInputDto,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    projectId?: string,
  ): Promise<IHttpResponse<CreateUserAdminOutputDto | Error>> {
    const user = await this.createUser.execute({
      email: input.email,
      id: input.id,
      name: input.name,
    });

    const response = this.mapToOutput(user);
    return ok(response);
  }

  private mapToOutput(user: IUser): CreateUserAdminOutputDto {
    return new CreateUserAdminOutputDto(user);
  }
}

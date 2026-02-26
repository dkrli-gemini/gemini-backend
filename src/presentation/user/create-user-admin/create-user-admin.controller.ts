import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectRoleModel, ProjectTypeModel } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { ICreateUser } from 'src/domain/contracts/use-cases/user/create-user';
import { IUser } from 'src/domain/entities/user';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { Public } from 'src/infra/auth/auth.decorator';
import { KeycloakService } from 'src/infra/auth/keycloak.service';
import { KeycloakAuthGuard } from 'src/infra/auth/keycloak.guard';
import { Roles, RolesEnum, RolesGuard } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import { CreateUserAdminInputDto } from './dtos/create-user-admin.input.dto';
import { CreateUserAdminOutputDto } from './dtos/create-user-admin.output.dto';
import { RegisterUserInputDto } from './dtos/register-user.input.dto';
import { RegisterUserOutputDto } from './dtos/register-user.output.dto';
import { AssignUserOrganizationInputDto } from './dtos/assign-user-organization.input.dto';
import { AssignUserOrganizationOutputDto } from './dtos/assign-user-organization.output.dto';

@UseGuards(KeycloakAuthGuard, RolesGuard)
@Controller('users')
@ApiTags('user')
export class CreateUserAdminController
  implements IController<CreateUserAdminInputDto, CreateUserAdminOutputDto>
{
  constructor(
    private readonly createUser: ICreateUser,
    private readonly prisma: PrismaService,
    private readonly keycloakService: KeycloakService,
  ) {}

  @Roles(RolesEnum.ADMIN)
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

  @Public()
  @Post('register')
  async register(
    @Body() input: RegisterUserInputDto,
  ): Promise<IHttpResponse<RegisterUserOutputDto | Error>> {
    const username = this.resolveUsername(input.email, input.username);
    if (!input.password || input.password.trim().length < 6) {
      throwsException(
        new InvalidParamError(
          'Senha inválida. Informe pelo menos 6 caracteres.',
        ),
      );
    }

    const keycloakResult = await this.keycloakService.createOrGetUser({
      username,
      email: input.email,
      firstName: input.name,
      lastName: '',
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: input.password,
          temporary: false,
        },
      ],
    });

    const user = await this.prisma.userModel.upsert({
      where: { id: keycloakResult.id },
      update: {
        name: input.name,
        email: input.email,
      },
      create: {
        id: keycloakResult.id,
        name: input.name,
        email: input.email,
      },
    });

    await this.keycloakService.ensureRealmRoles(keycloakResult.id, [
      RolesEnum.BASIC,
    ]);

    return ok(
      new RegisterUserOutputDto({
        id: user.id,
        name: user.name,
        email: user.email,
        username,
        keycloakCreated: keycloakResult.created,
      }),
    );
  }

  @Roles(RolesEnum.ADMIN)
  @Post('assign-organization')
  async assignOrganization(
    @Body() input: AssignUserOrganizationInputDto,
  ): Promise<IHttpResponse<AssignUserOrganizationOutputDto | Error>> {
    const replaceExisting = input.replaceExisting !== false;

    const [user, domain] = await Promise.all([
      this.prisma.userModel.findUnique({
        where: { id: input.userId },
        select: { id: true },
      }),
      this.prisma.domainModel.findUnique({
        where: { id: input.domainId },
        select: { id: true, name: true },
      }),
    ]);

    if (!user) {
      throwsException(new InvalidParamError('Usuário não encontrado.'));
    }
    if (!domain) {
      throwsException(new InvalidParamError('Organização não encontrada.'));
    }

    let project = await this.prisma.projectModel.findFirst({
      where: { domainId: input.domainId, type: ProjectTypeModel.ROOT },
      select: { id: true, name: true },
    });

    if (!project) {
      project = await this.prisma.projectModel.create({
        data: {
          name: `${domain.name}-root`,
          type: ProjectTypeModel.ROOT,
          domainId: input.domainId,
        },
        select: { id: true, name: true },
      });
    }

    if (replaceExisting) {
      await this.prisma.domainMemberModel.deleteMany({
        where: {
          project: {
            domainId: input.domainId,
          },
        },
      });
    }

    const existingMembership = await this.prisma.domainMemberModel.findFirst({
      where: {
        userId: input.userId,
        projectModelId: project.id,
      },
      select: { id: true },
    });

    if (existingMembership) {
      await this.prisma.domainMemberModel.update({
        where: { id: existingMembership.id },
        data: { role: ProjectRoleModel.OWNER },
      });
    } else {
      await this.prisma.domainMemberModel.create({
        data: {
          userId: input.userId,
          projectModelId: project.id,
          role: ProjectRoleModel.OWNER,
        },
      });
    }

    await this.keycloakService.ensureRealmRoles(input.userId, [
      RolesEnum.ADMIN,
      RolesEnum.BASIC,
    ]);

    return ok(
      new AssignUserOrganizationOutputDto({
        userId: input.userId,
        domainId: input.domainId,
        projectId: project.id,
        role: ProjectRoleModel.OWNER,
      }),
    );
  }

  private resolveUsername(email: string, username?: string): string {
    if (username && username.trim().length > 0) {
      return username.trim();
    }

    const value = email?.split('@')[0]?.trim();
    if (!value) {
      throwsException(
        new InvalidParamError(
          'username é obrigatório quando o email não for válido.',
        ),
      );
    }
    return value;
  }
}

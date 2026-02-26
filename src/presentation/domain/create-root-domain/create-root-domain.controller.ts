/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { CreateRootDomainInputDto } from './dtos/create-root-domain.input.dto';
import { CreateRootDomainOutputDto } from './dtos/create-root-domain.output.dto';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { ICreateRootDomain } from 'src/domain/contracts/use-cases/domain/create-root-domain';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { KeycloakService } from 'src/infra/auth/keycloak.service';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';

@Controller('domain')
export class CreateRootDomainController
  implements IController<CreateRootDomainInputDto, CreateRootDomainOutputDto>
{
  constructor(
    private readonly useCase: ICreateRootDomain,
    private readonly keycloakService: KeycloakService,
    private readonly prisma: PrismaService,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Post('create-root-domain')
  async handle(
    @Body() input: CreateRootDomainInputDto,
    @Req()
    req: Request,
    _projectId?: string,
  ): Promise<IHttpResponse<CreateRootDomainOutputDto | Error>> {
    const requester = req.user as any;
    const createdOwner = await this.createOwnerUserIfNeeded(input.ownerUser);
    const ownerId = createdOwner?.id ?? input.ownerId ?? requester?.id;
    const ownerEmail =
      createdOwner?.email ?? requester?.email ?? input.accountEmail;
    const ownerName =
      createdOwner?.name ??
      requester?.username ??
      requester?.name ??
      ownerEmail?.split?.('@')?.[0] ??
      input.accountName;
    const ownerUsername = createdOwner?.username ?? requester?.username;

    if (!ownerId) {
      throwsException(
        new InvalidParamError(
          'Informe ownerId ou ownerUser para criar o dono da organização root.',
        ),
      );
    }

    const response = await this.useCase.execute({
      ownerId,
      ownerName,
      ownerEmail,
      ownerUsername,
      accountName: input.accountName,
      accountEmail: input.accountEmail,
      accountPassword: input.accountPassword,
    });

    const result = new CreateRootDomainOutputDto(response);
    return created(result);
  }

  private async createOwnerUserIfNeeded(
    input?: {
      name: string;
      email: string;
      username: string;
      password: string;
    },
  ): Promise<{ id: string; email: string; name: string; username: string } | null> {
    if (!input) {
      return null;
    }

    const keycloakUser = await this.keycloakService.createOrGetUser({
      username: input.username,
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

    await this.keycloakService.ensureRealmRoles(keycloakUser.id, [
      RolesEnum.ADMIN,
      RolesEnum.BASIC,
    ]);

    await this.prisma.userModel.upsert({
      where: { id: keycloakUser.id },
      update: {
        name: input.name,
        email: input.email,
      },
      create: {
        id: keycloakUser.id,
        name: input.name,
        email: input.email,
      },
    });

    return {
      id: keycloakUser.id,
      email: input.email,
      name: input.name,
      username: input.username,
    };
  }
}

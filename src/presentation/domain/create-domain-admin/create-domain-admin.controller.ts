/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Req } from '@nestjs/common';
import { DomainTypeModel, ProjectRoleModel } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IController } from 'src/domain/contracts/controller';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { ICreateDomain } from 'src/domain/contracts/use-cases/domain/create-domain';
import {
  IDomain,
  IDomainType,
  OrganizationBillingType,
} from 'src/domain/entities/domain';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { KeycloakService } from 'src/infra/auth/keycloak.service';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import { CreateDomainAdminInputDto } from './dtos/create-domain-admin.input.dto';
import { CreateDomainChildInputDto } from './dtos/create-domain-child.input.dto';
import { CreateDomainAdminOutputDto } from './dtos/create-domain-admin.output.dto';

@Controller('domain')
@ApiTags('domain')
export class CreateDomainAdminController
  implements IController<CreateDomainAdminInputDto, CreateDomainAdminOutputDto>
{
  constructor(
    private readonly useCase: ICreateDomain,
    private readonly prisma: PrismaService,
    private readonly keycloakService: KeycloakService,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Post('/create-domain-admin')
  async handle(
    @Body() input: CreateDomainAdminInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    _projectId?: string,
  ): Promise<IHttpResponse<CreateDomainAdminOutputDto | Error>> {
    const domain = await this.useCase.execute({
      name: input.name,
      ownerId: input.ownerId,
      accountEmail: input.accountEmail,
      accountPassword: input.accountPassword,
      rootId: input.rootId,
      billingType: input.billingType as OrganizationBillingType,
      type: (input.type as IDomainType) ?? IDomainType.PARTNER,
      isDistributor: input.isDistributor,
    });

    const response = this.mapToOutput(domain);
    return created(response);
  }

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Post('/create-child')
  async createChild(
    @Body() input: CreateDomainChildInputDto,
    @Req()
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<IHttpResponse<CreateDomainAdminOutputDto | Error>> {
    const parentDomain = await this.prisma.domainModel.findUnique({
      where: { id: input.parentDomainId },
      select: { id: true, isDistributor: true, type: true },
    });

    if (!parentDomain) {
      throwsException(new InvalidParamError('Domínio pai não encontrado.'));
    }

    const requester = req.user as any;
    const requesterRoles: string[] = Array.isArray(requester?.roles)
      ? requester.roles
      : [];
    const isAdmin = requesterRoles.includes(RolesEnum.ADMIN);

    if (!isAdmin) {
      if (!parentDomain.isDistributor) {
        throwsException(
          new InvalidParamError(
            'Somente organizações distribuidoras podem criar clientes ou distribuidoras filhas.',
          ),
        );
      }

      const membershipCount = await this.prisma.domainMemberModel.count({
        where: {
          userId: requester?.id,
          role: { in: [ProjectRoleModel.OWNER, ProjectRoleModel.ADMIN] },
          project: {
            domainId: input.parentDomainId,
          },
        },
      });

      if (membershipCount === 0) {
        throwsException(
          new InvalidParamError(
            'Usuário sem permissão para criar organizações neste domínio.',
          ),
        );
      }
    }

    const normalizedKind = (input.childKind ?? '').toUpperCase();
    if (normalizedKind !== 'CLIENT' && normalizedKind !== 'DISTRIBUTOR') {
      throwsException(
        new InvalidParamError(
          'childKind inválido. Use CLIENT ou DISTRIBUTOR.',
        ),
      );
    }

    const parentEffectiveBillingType = await this.resolveEffectiveBillingType(
      input.parentDomainId,
    );
    const requestedBillingType = (input.billingType ??
      OrganizationBillingType.POOL) as OrganizationBillingType;

    if (
      parentEffectiveBillingType === OrganizationBillingType.POOL &&
      parentDomain.type !== DomainTypeModel.ROOT &&
      requestedBillingType === OrganizationBillingType.PAYG
    ) {
      throwsException(
        new InvalidParamError(
          'Este domínio não pode ser PAYG porque o distribuidor acima é limitado (POOL).',
        ),
      );
    }

    const ownerId = input.ownerUser
      ? await this.createOwnerUserIfNeeded(input.ownerUser)
      : input.ownerId;

    if (!ownerId) {
      throwsException(
        new InvalidParamError(
          'Informe ownerId ou ownerUser para criar o dono da nova organização.',
        ),
      );
    }

    if (input.ownerId) {
      const owner = await this.prisma.userModel.findUnique({
        where: { id: input.ownerId },
        select: { id: true },
      });

      if (!owner) {
        throwsException(new InvalidParamError('ownerId não encontrado.'));
      }
    }

    const type =
      normalizedKind === 'DISTRIBUTOR' ? IDomainType.PARTNER : IDomainType.CLIENT;
    const isDistributor = normalizedKind === 'DISTRIBUTOR';

    const domain = await this.useCase.execute({
      name: input.name,
      ownerId,
      accountEmail: input.accountEmail,
      accountPassword: input.accountPassword,
      rootId: input.parentDomainId,
      billingType: requestedBillingType,
      type,
      isDistributor,
    });

    return created(this.mapToOutput(domain));
  }

  private async createOwnerUserIfNeeded(
    input?: {
      name: string;
      email: string;
      username: string;
      password: string;
    },
  ): Promise<string | null> {
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

    return keycloakUser.id;
  }

  private async resolveEffectiveBillingType(
    domainId: string,
  ): Promise<OrganizationBillingType> {
    const chainFromCurrent: Array<{
      id: string;
      rootId: string | null;
      billingType: OrganizationBillingType;
    }> = [];

    let cursorId: string | null = domainId;
    let guard = 0;

    while (cursorId) {
      const domain = await this.prisma.domainModel.findUnique({
        where: { id: cursorId },
        select: {
          id: true,
          rootId: true,
          billingType: true,
        },
      });

      if (!domain) {
        throwsException(new InvalidParamError('Domínio não encontrado.'));
      }

      chainFromCurrent.push({
        id: domain.id,
        rootId: domain.rootId,
        billingType: domain.billingType as OrganizationBillingType,
      });
      cursorId = domain.rootId;
      guard += 1;

      if (guard > 20) {
        throwsException(
          new InvalidParamError(
            'Hierarquia de domínios inválida. Verifique a configuração de rootId.',
          ),
        );
      }
    }

    const chain = chainFromCurrent.reverse();
    let effective = chain[0]?.billingType ?? OrganizationBillingType.POOL;

    for (let index = 1; index < chain.length; index += 1) {
      const current = chain[index];
      effective =
        effective === OrganizationBillingType.POOL
          ? OrganizationBillingType.POOL
          : current.billingType;
    }

    return effective;
  }

  private mapToOutput(domain: IDomain): CreateDomainAdminOutputDto {
    return new CreateDomainAdminOutputDto(domain);
  }
}

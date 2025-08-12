/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IAclList, IAclRule } from 'src/domain/entities/acl-list';
import { IAclRulesRepository } from 'src/domain/repository/acl-rules.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class AclRulesRepositoryAdapter implements IAclRulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAclList(input: IAclList): Promise<IAclList> {
    const list = await this.prisma.aclListModel.create({
      data: {
        id: input.id,
        name: input.name,
        description: input.description,
        vpcId: input.vpcId,
      },
    });

    return {
      name: list.name,
      id: list.id,
      vpcId: list.vpcId,
      description: list.description,
    };
  }

  async createAclRule(input: IAclRule): Promise<IAclRule> {
    const acl = await this.prisma.aclRuleModel.create({
      data: {
        id: input.id,
        action: input.action,
        endPort: input.endPort,
        protocol: input.protocol,
        startPort: input.startPort,
        trafficType: input.trafficType,
        aclId: input.aclId,
        cidrList: input.cidrList,
      },
    });

    return this.mapToDomain(acl);
  }

  async listAclByList(aclListId: string): Promise<IAclRule[]> {
    const acls = await this.prisma.aclRuleModel.findMany({
      where: {
        aclId: aclListId,
      },
    });

    const response = acls.map((a) => this.mapToDomain(a));
    return response;
  }

  mapToDomain(persistencyObject: any): IAclRule {
    const acl: IAclRule = {
      id: persistencyObject.id,
      aclId: persistencyObject.aclId,
      cidrList: persistencyObject.cidrList,
      action: persistencyObject.action,
      startPort: persistencyObject.startPort,
      endPort: persistencyObject.endPort,
      trafficType: persistencyObject.trafficType,
      protocol: persistencyObject.protocol,
    };

    return acl;
  }
}

export const AclRulesRepositoryProvider: Provider = {
  provide: IAclRulesRepository,
  useClass: AclRulesRepositoryAdapter,
};

import { Injectable, Provider } from '@nestjs/common';
import {
  ICreateForwardRule,
  ICreateForwardRuleInput,
  ICreateForwardRuleOutput,
} from 'src/domain/contracts/create-forward-rule';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class CreateForwardRule implements ICreateForwardRule {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudstack: CloudstackService,
  ) {}

  async execute(
    input: ICreateForwardRuleInput,
  ): Promise<ICreateForwardRuleOutput> {
    const machine = await this.prisma.virtualMachineModel.findUnique({
      where: { id: input.machineId },
    });

    const rule = await this.cloudstack.handle({
      command: CloudstackCommands.VPC.CreatePortForwardRule,
      additionalParams: {
        ipaddressid: input.publicIpId,
        privateport: input.privateStart,
        privateendport: input.privateEnd,
        publicport: input.publicStart,
        publicendport: input.publicEnd,
        protocol: input.protocol,
        virtualmachineid: input.machineId,
        networkid: machine.networkId,
        cidrlist: input.address,
      },
    });

    const forwardCreated = await this.prisma.portForwardRuleModel.create({
      data: {
        privatePortEnd: input.privateEnd,
        privatePortStart: input.privateStart,
        publicPortEnd: input.publicEnd,
        publicPortStart: input.publicStart,
        protocol: input.protocol,
        id: rule.createportforwardingruleresponse.id,
        virtualMachineId: input.machineId,
        projectId: input.projectId,
        publicIpId: input.publicIpId,
        sourceCidrs: [input.address],
      },
    });

    return { id: forwardCreated.id };
  }
}

export const CreateForwardRuleProvider: Provider = {
  provide: ICreateForwardRule,
  useClass: CreateForwardRule,
};

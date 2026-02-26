import { Injectable } from '@nestjs/common';
import { DomainTypeModel, Prisma, ResourceType } from '@prisma/client';
import { OrganizationBillingType } from 'src/domain/entities/domain';
import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';

export interface ConsumptionItem {
  resourceId: string;
  resourceType: ResourceTypeEnum;
  quantity: number;
  description: string;
  metadata?: Record<string, unknown>;
  unitPriceInCents?: number;
  virtualMachineId?: string;
  billable?: boolean;
}

export interface RegisterUsageInput {
  domainId: string;
  projectId?: string;
  consumptions: ConsumptionItem[];
}

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async reconcileUsage(domainId?: string, projectId?: string): Promise<void> {
    const resolvedDomainId = await this.resolveDomainId(domainId, projectId);
    if (!resolvedDomainId) {
      return;
    }

    const projects = await this.prisma.projectModel.findMany({
      where: { domainId: resolvedDomainId },
      include: {
        VirtualMachineModel: {
          include: { instance: true },
        },
        NetworkModel: true,
        PublicIPModel: true,
      },
    });
    const usageTotals = new Map<ResourceTypeEnum, number>();
    const accumulateUsage = (
      type: ResourceTypeEnum,
      amount?: number | null,
    ) => {
      if (!this.hasPositiveValue(amount)) {
        return;
      }
      const previous = usageTotals.get(type) ?? 0;
      usageTotals.set(type, previous + amount);
    };

    for (const project of projects) {
      const [existingEntries, existingUsage] = await Promise.all([
        this.prisma.billingEntryModel.findMany({
          where: {
            domainId: project.domainId,
            projectId: project.id,
          },
          select: {
            resourceId: true,
            resourceType: true,
          },
        }),
        this.prisma.resourceUsageEventModel.findMany({
          where: {
            domainId: project.domainId,
            projectId: project.id,
          },
          select: {
            resourceId: true,
            resourceType: true,
          },
        }),
      ]);

      const existingBillingKeys = new Set(
        existingEntries.map((entry) =>
          this.buildResourceKey(entry.resourceId, entry.resourceType),
        ),
      );

      const existingUsageKeys = new Set(
        existingUsage.map((usage) =>
          this.buildResourceKey(usage.resourceId, usage.resourceType),
        ),
      );

      const consumptions: ConsumptionItem[] = [];

      for (const vm of project.VirtualMachineModel) {
        const vmName = vm.name ?? 'Máquina virtual';
        accumulateUsage(ResourceTypeEnum.INSTANCES, 1);
        accumulateUsage(ResourceTypeEnum.CPU, vm.cpuNumber);
        accumulateUsage(ResourceTypeEnum.MEMORY, vm.memoryInMb);
        accumulateUsage(ResourceTypeEnum.VOLUMES, vm.rootDiskSizeInGb);

        if (
          !existingBillingKeys.has(
            this.buildResourceKey(vm.id, ResourceTypeEnum.INSTANCES),
          )
        ) {
          consumptions.push({
            resourceId: vm.id,
            resourceType: ResourceTypeEnum.INSTANCES,
            quantity: 1,
            description: `Máquina virtual ${vmName}`,
            virtualMachineId: vm.id,
            metadata: {
              cpuNumber: vm.cpuNumber,
              cpuSpeedMhz: vm.cpuSpeedMhz,
              memoryInMb: vm.memoryInMb,
              rootDiskSizeInGb: vm.rootDiskSizeInGb,
              offerName: vm.instance?.name,
            },
          });
        }

        if (
          this.hasPositiveValue(vm.cpuNumber) &&
          !existingUsageKeys.has(
            this.buildResourceKey(vm.id, ResourceTypeEnum.CPU),
          )
        ) {
          consumptions.push({
            resourceId: vm.id,
            resourceType: ResourceTypeEnum.CPU,
            quantity: vm.cpuNumber,
            description: `${vmName}`,
            metadata: {
              cpuNumber: vm.cpuNumber,
              cpuSpeedMhz: vm.cpuSpeedMhz,
            },
            virtualMachineId: vm.id,
            billable: false,
          });
        }

        if (
          this.hasPositiveValue(vm.memoryInMb) &&
          !existingUsageKeys.has(
            this.buildResourceKey(vm.id, ResourceTypeEnum.MEMORY),
          )
        ) {
          consumptions.push({
            resourceId: vm.id,
            resourceType: ResourceTypeEnum.MEMORY,
            quantity: vm.memoryInMb,
            description: `Memória para ${vmName}`,
            metadata: {
              memoryInMb: vm.memoryInMb,
            },
            virtualMachineId: vm.id,
            billable: false,
          });
        }

        if (
          this.hasPositiveValue(vm.rootDiskSizeInGb) &&
          !existingUsageKeys.has(
            this.buildResourceKey(vm.id, ResourceTypeEnum.VOLUMES),
          )
        ) {
          consumptions.push({
            resourceId: vm.id,
            resourceType: ResourceTypeEnum.VOLUMES,
            quantity: vm.rootDiskSizeInGb,
            description: `Disco raiz ${vmName}`,
            metadata: {
              rootDiskSizeInGb: vm.rootDiskSizeInGb,
              isRoot: true,
            },
            virtualMachineId: vm.id,
            billable: false,
          });
        }
      }

      const volumes = await this.prisma.volumeModel.findMany({
        where: {
          machine: {
            projectId: project.id,
          },
        },
      });

      for (const volume of volumes) {
        const volumeName = volume.name ?? volume.id;
        if (
          !this.hasPositiveValue(volume.sizeInGb) ||
          existingBillingKeys.has(
            this.buildResourceKey(volume.id, ResourceTypeEnum.VOLUMES),
          )
        ) {
          continue;
        }

        accumulateUsage(ResourceTypeEnum.VOLUMES, volume.sizeInGb);
        consumptions.push({
          resourceId: volume.id,
          resourceType: ResourceTypeEnum.VOLUMES,
          quantity: volume.sizeInGb,
          description: `Volume ${volumeName}`,
          metadata: {
            sizeInGb: volume.sizeInGb,
            machineId: volume.machineId,
          },
          virtualMachineId: volume.machineId ?? undefined,
        });
      }

      for (const network of project.NetworkModel) {
        if (
          existingBillingKeys.has(
            this.buildResourceKey(network.id, ResourceTypeEnum.NETWORK),
          )
        ) {
          continue;
        }

        accumulateUsage(ResourceTypeEnum.NETWORK, 1);
        consumptions.push({
          resourceId: network.id,
          resourceType: ResourceTypeEnum.NETWORK,
          quantity: 1,
          description: `${network.name}`,
          metadata: {
            gateway: network.gateway,
            netmask: network.netmask,
          },
        });
      }

      for (const ip of project.PublicIPModel) {
        if (
          existingBillingKeys.has(
            this.buildResourceKey(ip.id, ResourceTypeEnum.PUBLICIP),
          )
        ) {
          continue;
        }

        accumulateUsage(ResourceTypeEnum.PUBLICIP, 1);
        consumptions.push({
          resourceId: ip.id,
          resourceType: ResourceTypeEnum.PUBLICIP,
          quantity: 1,
          description: `IP público ${ip.address || ip.id}`,
          metadata: {
            vpcId: ip.vpcId,
            address: ip.address,
          },
        });
      }

      if (consumptions.length) {
        await this.registerUsage({
          domainId: project.domainId,
          projectId: project.id,
          consumptions,
        });
      }
    }

    const propagatedEvents = await this.prisma.resourceUsageEventModel.findMany({
      where: { domainId: resolvedDomainId },
      select: {
        resourceType: true,
        amount: true,
        metadata: true,
      },
    });

    for (const event of propagatedEvents) {
      const metadata = (event.metadata ?? {}) as Record<string, unknown>;
      if (metadata.propagatedFromChild !== true) {
        continue;
      }

      const previous = usageTotals.get(event.resourceType as ResourceTypeEnum) ?? 0;
      usageTotals.set(
        event.resourceType as ResourceTypeEnum,
        previous + Number(event.amount ?? 0),
      );
    }

    await this.syncUsageTotals(resolvedDomainId, usageTotals);
  }

  async registerUsage(input: RegisterUsageInput): Promise<void> {
    if (!input?.consumptions?.length) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      const originDomain = await tx.domainModel.findUnique({
        where: { id: input.domainId },
        select: { id: true, name: true },
      });
      if (!originDomain) {
        throwsException(new InvalidParamError('Domínio não encontrado.'));
      }

      const billingType = await this.resolveEffectiveBillingType(tx, input.domainId);
      const ancestors = await this.listAncestorDomains(tx, input.domainId);

      for (const consumption of input.consumptions) {
        await this.updateResourceUsage(
          tx,
          billingType,
          input.domainId,
          consumption,
        );

        await tx.resourceUsageEventModel.create({
          data: {
            domainId: input.domainId,
            projectId: input.projectId,
            resourceId: consumption.resourceId,
            resourceType: consumption.resourceType as ResourceType,
            amount: consumption.quantity,
            metadata: (consumption.metadata ?? {}) as Prisma.JsonValue,
            virtualMachineId: consumption.virtualMachineId ?? undefined,
          },
        });

        const unitPrice =
          consumption.unitPriceInCents ??
          (billingType === OrganizationBillingType.PAYG
            ? await this.resolveEffectiveUnitPriceInCents(
                tx,
                input.domainId,
                consumption.resourceType,
              )
            : 0);

        if (consumption.billable ?? true) {
          await tx.billingEntryModel.create({
            data: {
              domainId: input.domainId,
              projectId: input.projectId,
              resourceId: consumption.resourceId,
              resourceType: consumption.resourceType as ResourceType,
              description: consumption.description,
              quantity: consumption.quantity,
              unitPriceInCents: unitPrice,
              totalInCents: unitPrice * consumption.quantity,
              virtualMachineId: consumption.virtualMachineId ?? undefined,
              metadata: (consumption.metadata ?? {}) as Prisma.JsonValue,
            },
          });
        }

        // Cascading purchase model:
        // when a child consumes, each non-root ancestor needs to acquire the same resource upstream.
        for (const ancestor of ancestors) {
          if (ancestor.type === DomainTypeModel.ROOT) {
            continue;
          }

          const propagatedResourceId = this.buildPropagationResourceId(
            input.domainId,
            consumption,
          );

          const alreadyPropagated = await tx.resourceUsageEventModel.findFirst({
            where: {
              domainId: ancestor.id,
              resourceId: propagatedResourceId,
              resourceType: consumption.resourceType as ResourceType,
            },
            select: { id: true },
          });

          if (alreadyPropagated) {
            continue;
          }

          const ancestorBillingType = await this.resolveEffectiveBillingType(
            tx,
            ancestor.id,
          );

          await this.updateResourceUsage(
            tx,
            ancestorBillingType,
            ancestor.id,
            consumption,
          );

          const propagatedMetadata = {
            ...(consumption.metadata ?? {}),
            sourceDomainId: input.domainId,
            sourceDomainName: originDomain.name,
            sourceResourceId: consumption.resourceId,
            sourceProjectId: input.projectId,
            propagatedFromChild: true,
          };

          await tx.resourceUsageEventModel.create({
            data: {
              domainId: ancestor.id,
              resourceId: propagatedResourceId,
              resourceType: consumption.resourceType as ResourceType,
              amount: consumption.quantity,
              metadata: propagatedMetadata as Prisma.JsonValue,
              virtualMachineId: consumption.virtualMachineId ?? undefined,
            },
          });

          const propagatedUnitPrice =
            consumption.unitPriceInCents ??
            (ancestorBillingType === OrganizationBillingType.PAYG
              ? await this.resolveEffectiveUnitPriceInCents(
                  tx,
                  ancestor.id,
                  consumption.resourceType,
                )
              : 0);

          if (consumption.billable ?? true) {
            await tx.billingEntryModel.create({
              data: {
                domainId: ancestor.id,
                resourceId: propagatedResourceId,
                resourceType: consumption.resourceType as ResourceType,
                description: `Repasse automático do filho ${originDomain.name}: ${consumption.description}`,
                quantity: consumption.quantity,
                unitPriceInCents: propagatedUnitPrice,
                totalInCents: propagatedUnitPrice * consumption.quantity,
                virtualMachineId: consumption.virtualMachineId ?? undefined,
                metadata: propagatedMetadata as Prisma.JsonValue,
              },
            });
          }
        }
      }
    });
  }

  private async updateResourceUsage(
    tx: Prisma.TransactionClient,
    billingType: OrganizationBillingType,
    domainId: string,
    consumption: ConsumptionItem,
  ): Promise<void> {
    const domain = await tx.domainModel.findUnique({
      where: { id: domainId },
      select: { type: true },
    });

    if (!domain) {
      throwsException(new InvalidParamError('Domínio não encontrado.'));
    }

    let limit = await tx.resourceLimitModel.findFirst({
      where: {
        domainId,
        type: consumption.resourceType as ResourceType,
      },
    });

    if (!limit) {
      limit = await tx.resourceLimitModel.create({
        data: {
          domainId,
          type: consumption.resourceType as ResourceType,
          limit: 0,
          used: 0,
        },
      });
    }

    const delta = consumption.quantity;
    const newUsed = Math.max(0, limit.used + delta);

    if (
      domain.type !== DomainTypeModel.ROOT &&
      billingType === OrganizationBillingType.POOL &&
      delta > 0 &&
      limit.limit > 0 &&
      newUsed > limit.limit
    ) {
      throwsException(
        new InvalidParamError(
          `Limite excedido para ${consumption.resourceType}`,
        ),
      );
    }

    await tx.resourceLimitModel.update({
      where: { id: limit.id },
      data: { used: newUsed },
    });
  }

  private async listAncestorDomains(
    tx: Prisma.TransactionClient,
    domainId: string,
  ): Promise<Array<{ id: string; name: string; type: DomainTypeModel }>> {
    const ancestors: Array<{ id: string; name: string; type: DomainTypeModel }> =
      [];

    let cursorId: string | null = domainId;
    let guard = 0;

    while (cursorId) {
      const current = await tx.domainModel.findUnique({
        where: { id: cursorId },
        select: { rootId: true },
      });
      if (!current?.rootId) {
        break;
      }

      const parent = await tx.domainModel.findUnique({
        where: { id: current.rootId },
        select: {
          id: true,
          name: true,
          type: true,
          rootId: true,
        },
      });

      if (!parent) {
        break;
      }

      ancestors.push({
        id: parent.id,
        name: parent.name,
        type: parent.type,
      });
      cursorId = parent.id;
      guard += 1;

      if (guard > 20) {
        throwsException(
          new InvalidParamError(
            'Hierarquia de domínios inválida. Verifique a configuração de rootId.',
          ),
        );
      }
    }

    return ancestors;
  }

  private buildPropagationResourceId(
    sourceDomainId: string,
    consumption: ConsumptionItem,
  ): string {
    return `prop:${sourceDomainId}:${consumption.resourceType}:${consumption.resourceId}`;
  }

  private defaultPriceFor(type: ResourceTypeEnum): number {
    const priceMap: Record<ResourceTypeEnum, number> = {
      [ResourceTypeEnum.INSTANCES]: 2500,
      [ResourceTypeEnum.CPU]: 250,
      [ResourceTypeEnum.MEMORY]: 150,
      [ResourceTypeEnum.VOLUMES]: 100,
      [ResourceTypeEnum.PUBLICIP]: 400,
      [ResourceTypeEnum.NETWORK]: 350,
    };

    return priceMap[type] ?? 0;
  }

  private async resolveEffectiveUnitPriceInCents(
    tx: Prisma.TransactionClient,
    domainId: string,
    resourceType: ResourceTypeEnum,
  ): Promise<number> {
    const chain: Array<{ id: string; rootId: string | null }> = [];
    let cursorId: string | null = domainId;
    let guard = 0;

    while (cursorId) {
      const domain = await tx.domainModel.findUnique({
        where: { id: cursorId },
        select: { id: true, rootId: true },
      });

      if (!domain) {
        break;
      }

      chain.push({
        id: domain.id,
        rootId: domain.rootId,
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

    const rootToCurrent = chain.reverse();
    let effectivePrice = 0;

    for (const domain of rootToCurrent) {
      const custom = await tx.domainResourcePriceModel.findUnique({
        where: {
          domainId_type: {
            domainId: domain.id,
            type: resourceType as unknown as ResourceType,
          },
        },
        select: { unitPriceInCents: true },
      });

      // Absolute override at each level.
      if (custom?.unitPriceInCents !== undefined) {
        effectivePrice = custom.unitPriceInCents;
      }
    }

    if (effectivePrice > 0) {
      return effectivePrice;
    }

    return this.defaultPriceFor(resourceType);
  }

  private async resolveDomainId(
    domainId?: string,
    projectId?: string,
  ): Promise<string | null> {
    if (domainId) {
      return domainId;
    }

    if (!projectId) {
      return null;
    }

    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
      select: { domainId: true },
    });

    return project?.domainId ?? null;
  }

  private async resolveEffectiveBillingType(
    tx: Prisma.TransactionClient,
    domainId: string,
  ): Promise<OrganizationBillingType> {
    const chain: Array<{
      id: string;
      rootId: string | null;
      billingType: OrganizationBillingType;
      type: DomainTypeModel;
    }> = [];

    let cursorId: string | null = domainId;
    let guard = 0;

    while (cursorId) {
      const domain = await tx.domainModel.findUnique({
        where: { id: cursorId },
        select: {
          id: true,
          rootId: true,
          billingType: true,
          type: true,
        },
      });

      if (!domain) {
        throwsException(new InvalidParamError('Domínio não encontrado.'));
      }

      chain.push({
        id: domain.id,
        rootId: domain.rootId,
        billingType: domain.billingType as OrganizationBillingType,
        type: domain.type,
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

    const rootToCurrent = chain.reverse();
    let effective =
      rootToCurrent[0]?.billingType ?? OrganizationBillingType.POOL;
    for (let index = 1; index < rootToCurrent.length; index += 1) {
      const parent = rootToCurrent[index - 1];
      const current = rootToCurrent[index];
      effective =
        effective === OrganizationBillingType.POOL &&
        parent.type !== DomainTypeModel.ROOT
          ? OrganizationBillingType.POOL
          : current.billingType;
    }

    return effective;
  }

  private buildResourceKey(
    resourceId: string,
    type: ResourceType | ResourceTypeEnum,
  ): string {
    return `${resourceId}:${type}`;
  }

  private hasPositiveValue(value?: number | null): value is number {
    return Number.isFinite(value) && value > 0;
  }

  private async syncUsageTotals(
    domainId: string,
    totals: Map<ResourceTypeEnum, number>,
  ): Promise<void> {
    const limits = await this.prisma.resourceLimitModel.findMany({
      where: { domainId },
    });

    await Promise.all(
      limits.map((limit) => {
        const target = totals.get(limit.type as ResourceTypeEnum) ?? 0;
        if (target === limit.used) {
          return Promise.resolve();
        }

        return this.prisma.resourceLimitModel.update({
          where: { id: limit.id },
          data: { used: target },
        });
      }),
    );
  }
}

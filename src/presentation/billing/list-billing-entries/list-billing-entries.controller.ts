import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import {
  BillingEntryDto,
  ListBillingEntriesOutputDto,
  MachineBillingSummaryInput,
  MachineSpecs,
} from './dtos/list-billing-entries.output.dto';
import { Request, Response } from 'express';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { ResourceType } from '@prisma/client';
import PDFDocument = require('pdfkit');
type PDFDocumentInstance = PDFKit.PDFDocument;

@Controller('billing')
export class ListBillingEntriesController
  implements IController<null, ListBillingEntriesOutputDto>
{
  private readonly machineResourceTypes = new Set<ResourceType>([
    ResourceType.INSTANCES,
    ResourceType.CPU,
    ResourceType.MEMORY,
    ResourceType.VOLUMES,
  ]);
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  private readonly dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  private readonly monthFormatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('entries')
  async handle(
    _input: null,
    @Req() req: Request,
    @Query('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListBillingEntriesOutputDto | Error>> {
    const domainIdFromQuery = req.query?.domainId as string | undefined;
    if (!projectId && !domainIdFromQuery) {
      throwsException(
        new InvalidParamError('É necessário informar projectId ou domainId.'),
      );
    }

    const resolvedDomainId =
      domainIdFromQuery ?? (await this.findDomainIdFromProject(projectId));

    if (!resolvedDomainId) {
      throwsException(
        new InvalidParamError('Domínio não encontrado para o projeto.'),
      );
    }

    await this.billingService.reconcileUsage(resolvedDomainId, projectId);

    const entries = await this.fetchBillingEntries(resolvedDomainId, projectId);

    const grouped = await this.groupEntriesByMachine(entries);

    return ok(
      new ListBillingEntriesOutputDto({
        machines: grouped.machines,
        otherEntries: grouped.otherEntries,
      }),
    );
  }

  @AuthorizedTo(RolesEnum.BASIC, RolesEnum.ADMIN)
  @Get('entries/export')
  async exportPdf(
    _input: null,
    @Req() req: Request,
    @Res() res: Response,
    @Query('projectId') projectId?: string,
  ): Promise<void> {
    const domainIdFromQuery = req.query?.domainId as string | undefined;
    if (!projectId && !domainIdFromQuery) {
      throwsException(
        new InvalidParamError('É necessário informar projectId ou domainId.'),
      );
    }

    const resolvedDomainId =
      domainIdFromQuery ?? (await this.findDomainIdFromProject(projectId));

    if (!resolvedDomainId) {
      throwsException(
        new InvalidParamError('Domínio não encontrado para o projeto.'),
      );
    }

    await this.billingService.reconcileUsage(resolvedDomainId, projectId);

    const entries = await this.fetchBillingEntries(resolvedDomainId, projectId);
    const grouped = await this.groupEntriesByMachine(entries);
    const dto = new ListBillingEntriesOutputDto({
      machines: grouped.machines,
      otherEntries: grouped.otherEntries,
    });

    const { domainName, projectName } = await this.resolveContextInfo(
      resolvedDomainId,
      projectId,
    );

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const now = new Date();
    const safeClient = domainName ?? resolvedDomainId ?? 'cliente';
    const fileName = `fatura-${this.sanitizeFileName(
      safeClient,
    )}-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);

    this.drawPdfHeader(doc, {
      domainName: domainName ?? '—',
      projectName: projectId ? (projectName ?? '—') : undefined,
      domainId: resolvedDomainId,
      totalInCents: dto.totalInCents,
    });

    this.drawMachineSection(doc, grouped.machines);
    this.drawOtherEntriesSection(doc, grouped.otherEntries);

    const pdfPromise = new Promise<void>((resolve, reject) => {
      doc.on('finish', resolve);
      doc.on('error', reject);
    });

    doc.end();
    await pdfPromise;
  }

  private async findDomainIdFromProject(
    projectId?: string,
  ): Promise<string | null> {
    if (!projectId) {
      return null;
    }

    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
      select: { domainId: true },
    });

    if (!project) {
      throwsException(new InvalidParamError('Projeto não encontrado.'));
    }

    return project.domainId;
  }

  private async fetchBillingEntries(
    domainId: string,
    projectId?: string,
  ): Promise<any[]> {
    return this.prisma.billingEntryModel.findMany({
      where: {
        domainId,
        ...(projectId ? { projectId } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        virtualMachine: {
          select: {
            id: true,
            name: true,
            cpuNumber: true,
            cpuSpeedMhz: true,
            memoryInMb: true,
            rootDiskSizeInGb: true,
            instance: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  private async groupEntriesByMachine(entries: any[]): Promise<{
    machines: MachineBillingSummaryInput[];
    otherEntries: BillingEntryDto[];
  }> {
    const fallbackVmIds = new Set<string>();
    for (const entry of entries) {
      if (
        !entry.virtualMachineId &&
        this.machineResourceTypes.has(entry.resourceType)
      ) {
        fallbackVmIds.add(entry.resourceId);
      }
    }

    const fallbackVmNameMap =
      fallbackVmIds.size > 0
        ? new Map(
            (
              await this.prisma.virtualMachineModel.findMany({
                where: { id: { in: Array.from(fallbackVmIds) } },
                select: {
                  id: true,
                  name: true,
                  instance: { select: { name: true } },
                },
              })
            ).map((vm) => [
              vm.id,
              {
                name: vm.name ?? 'Máquina virtual',
                offerName: vm.instance?.name,
              },
            ]),
          )
        : new Map<string, { name: string; offerName?: string }>();

    const machineMap = new Map<string, MachineBillingSummaryInput>();
    const otherEntries: BillingEntryDto[] = [];

    for (const entry of entries) {
      const dto = new BillingEntryDto(entry);
      const vmId = this.resolveVirtualMachineId(entry);

      if (!vmId) {
        otherEntries.push(dto);
        continue;
      }

      const fallback = fallbackVmNameMap.get(vmId);
      const machineName = entry.virtualMachine?.name ?? fallback?.name;

      if (!machineName) {
        otherEntries.push(dto);
        continue;
      }

      let machine = machineMap.get(vmId);
      if (!machine) {
        machine = {
          machineId: vmId,
          machineName,
          totalInCents: 0,
          entries: [] as BillingEntryDto[],
          createdAt: dto.createdAt,
          specs: this.buildMachineSpecs(entry),
          offerName:
            this.resolveOfferName(entry) ?? fallback?.offerName ?? undefined,
        };
        machineMap.set(vmId, machine);
      }

      if (!dto.virtualMachineId) {
        dto.virtualMachineId = vmId;
      }

      if (entry.resourceType === ResourceType.INSTANCES) {
        machine.totalInCents += dto.totalInCents ?? 0;
        if (!machine.createdAt || dto.createdAt < machine.createdAt) {
          machine.createdAt = dto.createdAt;
        }
        machine.specs = this.mergeMachineSpecs(
          machine.specs,
          this.buildMachineSpecs(entry),
        );
        if (!machine.offerName) {
          machine.offerName = this.resolveOfferName(entry);
        }
        continue;
      }

      if (this.isSpecOnlyEntry(entry, dto)) {
        machine.specs = this.mergeMachineSpecs(
          machine.specs,
          this.extractSpecsFromEntry(entry, dto),
        );
        if (!machine.offerName) {
          machine.offerName = this.resolveOfferName(entry);
        }
        continue;
      }

      if (entry.resourceType === ResourceType.VOLUMES) {
        machine.entries.push(dto);
        machine.totalInCents += dto.totalInCents ?? 0;
        continue;
      }

      otherEntries.push(dto);
    }

    return {
      machines: Array.from(machineMap.values()),
      otherEntries,
    };
  }

  private resolveVirtualMachineId(entry: any): string | undefined {
    if (entry.virtualMachineId) {
      return entry.virtualMachineId;
    }

    if (this.machineResourceTypes.has(entry.resourceType)) {
      return entry.resourceId;
    }

    return undefined;
  }

  private buildMachineSpecs(entry: any): MachineSpecs | undefined {
    const metadataSpecs = this.extractMachineSpecs(entry.metadata);
    if (metadataSpecs) {
      return metadataSpecs;
    }

    if (!entry.virtualMachine) {
      return undefined;
    }

    return {
      cpuNumber: this.asNumber(entry.virtualMachine.cpuNumber),
      cpuSpeedMhz: this.asNumber(entry.virtualMachine.cpuSpeedMhz),
      memoryInMb: this.asNumber(entry.virtualMachine.memoryInMb),
      rootDiskSizeInGb: this.asNumber(entry.virtualMachine.rootDiskSizeInGb),
    };
  }

  private mergeMachineSpecs(
    current?: MachineSpecs,
    incoming?: MachineSpecs,
  ): MachineSpecs | undefined {
    if (!incoming) {
      return current;
    }
    if (!current) {
      return incoming;
    }

    return {
      cpuNumber: current.cpuNumber ?? incoming.cpuNumber,
      cpuSpeedMhz: current.cpuSpeedMhz ?? incoming.cpuSpeedMhz,
      memoryInMb: current.memoryInMb ?? incoming.memoryInMb,
      rootDiskSizeInGb: current.rootDiskSizeInGb ?? incoming.rootDiskSizeInGb,
    };
  }

  private extractSpecsFromEntry(
    entry: any,
    dto: BillingEntryDto,
  ): MachineSpecs | undefined {
    if (entry.resourceType === ResourceType.CPU) {
      return {
        cpuNumber:
          this.asNumber(entry.metadata?.cpuNumber) ?? dto.quantity ?? undefined,
        cpuSpeedMhz: this.asNumber(entry.metadata?.cpuSpeedMhz),
      };
    }

    if (entry.resourceType === ResourceType.MEMORY) {
      return {
        memoryInMb:
          this.asNumber(entry.metadata?.memoryInMb) ??
          dto.quantity ??
          undefined,
      };
    }

    if (entry.resourceType === ResourceType.VOLUMES) {
      const size =
        this.asNumber(entry.metadata?.sizeInGb) ??
        this.asNumber(entry.metadata?.rootDiskSizeInGb) ??
        dto.quantity;
      return {
        rootDiskSizeInGb: size,
      };
    }

    return undefined;
  }

  private isSpecOnlyEntry(entry: any, dto: BillingEntryDto): boolean {
    if (entry.resourceType === ResourceType.CPU) {
      return true;
    }

    if (entry.resourceType === ResourceType.MEMORY) {
      return true;
    }

    if (entry.resourceType === ResourceType.VOLUMES) {
      if (dto.metadata?.['isRoot'] === true) {
        return true;
      }
      if (
        typeof entry.description === 'string' &&
        entry.description.toLowerCase().includes('disco raiz')
      ) {
        return true;
      }
    }

    return false;
  }

  private resolveOfferName(entry: any): string | undefined {
    const metadataName = entry.metadata?.offerName;
    if (metadataName && typeof metadataName === 'string') {
      return metadataName;
    }
    const instanceName = entry.virtualMachine?.instance?.name;
    return typeof instanceName === 'string' ? instanceName : undefined;
  }

  private extractMachineSpecs(
    metadata?: Record<string, unknown>,
  ): MachineSpecs | undefined {
    if (!metadata) {
      return undefined;
    }

    const specs: MachineSpecs = {
      cpuNumber: this.asNumber(metadata['cpuNumber']),
      cpuSpeedMhz: this.asNumber(metadata['cpuSpeedMhz']),
      memoryInMb: this.asNumber(metadata['memoryInMb']),
      rootDiskSizeInGb: this.asNumber(metadata['rootDiskSizeInGb']),
    };

    const hasValues =
      specs.cpuNumber !== undefined ||
      specs.cpuSpeedMhz !== undefined ||
      specs.memoryInMb !== undefined ||
      specs.rootDiskSizeInGb !== undefined;

    return hasValues ? specs : undefined;
  }

  private asNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }

  private async resolveContextInfo(
    domainId: string,
    projectId?: string,
  ): Promise<{ domainName?: string; projectName?: string }> {
    const [domain, project] = await Promise.all([
      this.prisma.domainModel.findUnique({
        where: { id: domainId },
        select: { name: true },
      }),
      projectId
        ? this.prisma.projectModel.findUnique({
            where: { id: projectId },
            select: { name: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      domainName: domain?.name ?? undefined,
      projectName: project?.name ?? undefined,
    };
  }

  private drawPdfHeader(
    doc: PDFDocumentInstance,
    params: {
      domainName: string;
      projectName?: string;
      domainId: string;
      totalInCents: number;
    },
  ) {
    const now = new Date();
    doc.fontSize(20).fillColor('#0F3759').text('Relatório de Faturamento');
    doc.fontSize(12).fillColor('#000000').text(`Cliente: ${params.domainName}`);
    if (params.projectName) {
      doc.text(`Projeto: ${params.projectName}`);
    }
    doc.text(`Domínio: ${params.domainId}`);
    doc.text(`Período: ${this.monthFormatter.format(now)}`);
    doc.text(`Emitido em: ${this.dateTimeFormatter.format(now)}`);
    doc
      .moveDown()
      .fontSize(14)
      .text(
        `Total faturado: ${this.currencyFormatter.format(
          (params.totalInCents ?? 0) / 100,
        )}`,
      )
      .moveDown();
  }

  private drawMachineSection(
    doc: PDFDocumentInstance,
    machines: MachineBillingSummaryInput[],
  ) {
    doc
      .fontSize(16)
      .fillColor('#0F3759')
      .text('Máquinas virtuais', { underline: true })
      .moveDown(0.5)
      .fillColor('#000000');

    if (machines.length === 0) {
      doc.fontSize(12).text('Nenhuma máquina faturada no período.').moveDown();
      return;
    }

    for (const machine of machines) {
      const specs = machine.specs;
      const baseLine = `${machine.machineName}${
        machine.offerName ? ` (${machine.offerName})` : ''
      }`;
      doc
        .fontSize(13)
        .text(
          `${baseLine} - ${this.currencyFormatter.format(
            (machine.totalInCents ?? 0) / 100,
          )}`,
        );
      doc
        .fontSize(10)
        .fillColor('#555555')
        .text(`Criada em: ${this.dateTimeFormatter.format(machine.createdAt)}`);
      doc
        .text(
          `vCPU: ${
            specs?.cpuNumber ?? '—'
          } • Memória: ${this.formatMemory(specs?.memoryInMb)} • Disco raiz: ${
            specs?.rootDiskSizeInGb ?? '—'
          } GB`,
        )
        .moveDown(0.2)
        .fillColor('#000000');

      if (machine.entries.length === 0) {
        doc.fontSize(10).text('Sem recursos adicionais faturados.').moveDown();
        continue;
      }

      doc.fontSize(11).text('Recursos adicionais:');
      for (const resource of machine.entries) {
        doc
          .fontSize(10)
          .text(
            `- ${resource.description} • ${this.dateTimeFormatter.format(
              resource.createdAt,
            )} • ${resource.quantity} • ${this.currencyFormatter.format(
              (resource.totalInCents ?? 0) / 100,
            )}`,
          );
      }
      doc.moveDown();
    }
  }

  private drawOtherEntriesSection(
    doc: PDFDocumentInstance,
    entries: BillingEntryDto[],
  ) {
    doc
      .addPage()
      .fontSize(16)
      .fillColor('#0F3759')
      .text('Outros custos', { underline: true })
      .moveDown(0.5)
      .fillColor('#000000');

    if (entries.length === 0) {
      doc.fontSize(12).text('Nenhum custo adicional registrado.').moveDown();
      return;
    }

    for (const entry of entries) {
      doc
        .fontSize(12)
        .text(
          `${entry.description} • ${this.dateTimeFormatter.format(
            entry.createdAt,
          )}`,
        );
      doc
        .fontSize(10)
        .fillColor('#555555')
        .text(
          `Tipo: ${entry.resourceType} • Quantidade: ${
            entry.quantity ?? '—'
          } • Valor: ${this.currencyFormatter.format(
            (entry.totalInCents ?? 0) / 100,
          )}`,
        )
        .moveDown(0.5)
        .fillColor('#000000');
    }
  }

  private formatMemory(memoryInMb?: number): string {
    if (memoryInMb === undefined) {
      return '—';
    }
    const inGb = memoryInMb / 1024;
    if (!Number.isFinite(inGb)) {
      return '—';
    }
    return `${Number(inGb.toFixed(inGb >= 10 ? 0 : 1))} GB`;
  }

  private sanitizeFileName(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
  }
}

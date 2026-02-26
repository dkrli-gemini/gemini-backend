import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

type OfferSeed = {
  sku: string;
  family: string;
  commercialName: string;
  profile: string;
  vcpu: number;
  ramGb: number;
  defaultDiskGb: number;
  diskTier: 'NVMe' | 'HDD';
};

const cpuSpeedPerCoreMhz = 2000;

const offers: OfferSeed[] = [
  {
    sku: 'NB-1v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 1,
    ramGb: 2,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NB-2v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 2,
    ramGb: 4,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NB-4v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 4,
    ramGb: 8,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NB-8v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 8,
    ramGb: 16,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NB-16v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 16,
    ramGb: 32,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NB-32v',
    family: 'NB',
    commercialName: 'Orion',
    profile: 'General Purpose',
    vcpu: 32,
    ramGb: 64,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-1v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 1,
    ramGb: 2,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-2v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 2,
    ramGb: 3,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-4v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 4,
    ramGb: 6,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-8v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 8,
    ramGb: 12,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-16v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 16,
    ramGb: 24,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NT-32v',
    family: 'NT',
    commercialName: 'Perseus',
    profile: 'CPU Optimized',
    vcpu: 32,
    ramGb: 48,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-1v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 1,
    ramGb: 4,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-2v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 2,
    ramGb: 8,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-4v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 4,
    ramGb: 16,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-8v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 8,
    ramGb: 32,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-16v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 16,
    ramGb: 64,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NL-32v',
    family: 'NL',
    commercialName: 'Andromeda',
    profile: 'Memory Optimized',
    vcpu: 32,
    ramGb: 128,
    defaultDiskGb: 80,
    diskTier: 'NVMe',
  },
  {
    sku: 'NA-1v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 1,
    ramGb: 2,
    defaultDiskGb: 100,
    diskTier: 'HDD',
  },
  {
    sku: 'NA-2v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 2,
    ramGb: 4,
    defaultDiskGb: 150,
    diskTier: 'HDD',
  },
  {
    sku: 'NA-4v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 4,
    ramGb: 8,
    defaultDiskGb: 250,
    diskTier: 'HDD',
  },
  {
    sku: 'NA-8v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 8,
    ramGb: 16,
    defaultDiskGb: 500,
    diskTier: 'HDD',
  },
  {
    sku: 'NA-16v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 16,
    ramGb: 32,
    defaultDiskGb: 1000,
    diskTier: 'HDD',
  },
  {
    sku: 'NA-32v',
    family: 'NA',
    commercialName: 'Lyra',
    profile: 'Storage Optimized',
    vcpu: 32,
    ramGb: 64,
    defaultDiskGb: 3000,
    diskTier: 'HDD',
  },
];

const deterministicUuidFromSku = (sku: string): string => {
  const hash = crypto.createHash('sha256').update(sku).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32),
  ].join('-');
};

async function main() {
  for (const offer of offers) {
    const id = deterministicUuidFromSku(offer.sku);
    const memoryInMb = offer.ramGb * 1024;
    const cpuSpeed = offer.vcpu * cpuSpeedPerCoreMhz;

    await prisma.instanceModel.upsert({
      where: { id },
      update: {
        name: `${offer.commercialName} ${offer.vcpu}v`,
        cpu: cpuSpeed.toString(),
        disk: offer.defaultDiskGb.toString(),
        memory: memoryInMb.toString(),
        cpuNumber: offer.vcpu,
        cpuSpeedMhz: cpuSpeed,
        memoryInMb,
        rootDiskSizeInGb: offer.defaultDiskGb,
        sku: offer.sku,
        family: offer.family,
        profile: offer.profile,
        diskTier: offer.diskTier,
      },
      create: {
        id,
        name: `${offer.commercialName} ${offer.vcpu}v`,
        cpu: cpuSpeed.toString(),
        disk: offer.defaultDiskGb.toString(),
        memory: memoryInMb.toString(),
        cpuNumber: offer.vcpu,
        cpuSpeedMhz: cpuSpeed,
        memoryInMb,
        rootDiskSizeInGb: offer.defaultDiskGb,
        sku: offer.sku,
        family: offer.family,
        profile: offer.profile,
        diskTier: offer.diskTier,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Instance offers imported successfully.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

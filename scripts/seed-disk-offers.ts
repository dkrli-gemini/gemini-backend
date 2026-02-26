import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DiskOfferSeed = {
  id: string;
  name: string;
  capacity: number;
};

// Configure os disk offers aqui.
const diskOffers: DiskOfferSeed[] = [
  {
    id: 'c25fdf16-ffd5-4a3a-9107-f4583a249157',
    name: 'Oferta Padrão',
    capacity: 100,
  },
];

async function main() {
  if (diskOffers.length === 0) {
    console.log('No disk offers configured. Nothing to seed.');
    return;
  }

  for (const offer of diskOffers) {
    await prisma.diskOfferModel.upsert({
      where: { id: offer.id },
      update: {
        name: offer.name,
        capacity: offer.capacity,
      },
      create: {
        id: offer.id,
        name: offer.name,
        capacity: offer.capacity,
      },
    });
  }

  console.log(`Seeded ${diskOffers.length} disk offers.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

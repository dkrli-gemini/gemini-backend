import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type TemplateSeed = {
  id: string;
  name: string;
  url?: string;
};

// Configure os templates aqui.
const templates: TemplateSeed[] = [
  {
    id: '49bbcba0-29ae-46b4-a59b-5c10ebd2b888',
    name: 'Ubuntu 22.04 LTS',
    url: '',
  },
];

async function main() {
  if (templates.length === 0) {
    console.log('No templates configured. Nothing to seed.');
    return;
  }

  for (const template of templates) {
    await prisma.templateOfferModel.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        url: template.url,
      },
      create: {
        id: template.id,
        name: template.name,
        url: template.url,
      },
    });
  }

  console.log(`Seeded ${templates.length} templates.`);
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

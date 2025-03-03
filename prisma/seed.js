import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const newUser = await prisma.user.create({
    data: {
      name: 'Test name',
      email: 'testmail@mail.com',
    },
  });

  console.log('User created!', newUser);
};

main()
  .catch((e) => console.log(error))
  .finally(async () => {
    await prisma.$disconnect();
  });

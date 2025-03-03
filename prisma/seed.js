import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addUser = async () => {
  const newUser = await prisma.user.create({
    data: {
      name: 'Test name',
      email: 'testmail@mail.com',
    },
  });

  console.log('User created!', newUser);
};

const updateUser = async () => {
  const updateUser = await prisma.user.updateMany({
    where: { name: 'Test name' },
    data: {
      name: 'new Name',
    },
  });

  console.log(updateUser);
};

const readUser = async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: 'Test name',
    },
  });

  console.log(user);
};

updateUser()
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

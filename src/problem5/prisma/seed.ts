import prisma from '../src/infrastructure/prisma/prisma';

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
  },
  {
    name: 'Alice Williams',
    email: 'alice@example.com',
  },
  {
    name: 'Alan Turing',
    email: 'alan@example.com',
  },
];

async function main(): Promise<void> {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Failed to seed mock users', error);
    await prisma.$disconnect();
    process.exit(1);
  });

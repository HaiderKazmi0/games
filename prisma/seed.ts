import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const games = [
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    description: 'An open-world action-adventure game set in the kingdom of Hyrule.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a801?ixlib=rb-4.0.3',
    rating: 4.8,
  },
  {
    title: 'Red Dead Redemption 2',
    description: 'A story-driven open-world game set in the American Wild West.',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3',
    rating: 4.9,
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    description: 'An open-world RPG following the story of Geralt of Rivia.',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3',
    rating: 4.7,
  },
  {
    title: 'God of War',
    description: 'An action-adventure game following Kratos and his son Atreus.',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3',
    rating: 4.9,
  },
  {
    title: 'Elden Ring',
    description: 'An action RPG set in a world created by Hidetaka Miyazaki and George R.R. Martin.',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3',
    rating: 4.8,
  },
];

async function main() {
  console.log('Start seeding...');

  // Create a user to be the creator of all games
  const user = await prisma.user.create({
    data: {
      name: 'Seed User',
      email: 'seeduser@example.com',
      password: 'password123', // In production, use hashed passwords!
    },
  });

  for (const game of games) {
    await prisma.game.create({
      data: {
        ...game,
        creatorId: user.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
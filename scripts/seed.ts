import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  // Create some games
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

  for (const game of games) {
    const existingGame = await prisma.game.findFirst({
      where: { title: game.title }
    });

    if (existingGame) {
      await prisma.game.update({
        where: { id: existingGame.id },
        data: {
          ...game,
          creatorId: user.id,
        },
      });
    } else {
      await prisma.game.create({
        data: {
          ...game,
          creatorId: user.id,
        },
      });
    }
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
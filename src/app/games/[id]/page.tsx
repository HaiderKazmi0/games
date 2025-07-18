import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import GameActions from '@/components/GameActions';
import Comments from '@/components/Comments';
import DeleteGameButton from '@/components/DeleteGameButton';

async function getGame(id: string) {
  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          votes: true,
          ratings: true,
        },
      },
    },
  });

  if (!game) {
    notFound();
  }

  return game;
}

export default async function GamePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const game = await getGame(id);
  const session = await getServerSession(authOptions);
  
  // Get the current user's ID from the database
  const currentUser = session?.user ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
          {/* Game Image */}
          <div className="relative h-96 w-full">
            <Image
              src={game.imageUrl}
              alt={game.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* Game Content */}
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
              {currentUser && game.creator.id === currentUser.id && (
                <DeleteGameButton gameId={game.id} />
              )}
            </div>
            <p className="text-gray-300 mb-8">{game.description}</p>

            {/* Game Actions */}
            <div className="mb-8">
              <GameActions game={game} />
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Comments ({game.comments.length})</h2>
              <Comments gameId={game.id} initialComments={game.comments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
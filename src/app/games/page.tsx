import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import DeleteGameButton from '@/components/DeleteGameButton';

async function getUserGames() {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  }) : null;

  if (!currentUser) {
    return [];
  }

  const games = await prisma.game.findMany({
    where: {
      creatorId: currentUser.id
    },
    include: {
      _count: {
        select: {
          comments: true,
          votes: true,
          ratings: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return games;
}

export default async function GamesPage() {
  const games = await getUserGames();

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Games</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Games</h1>
          <Link
            href="/add-game"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add New Game
          </Link>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-blue-500 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 z-20">
                <DeleteGameButton gameId={game.id} />
              </div>
              <Link href={`/games/${game.id}`}>
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                    {game.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>Rating: {game.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50">
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1">
            <button className="w-8 h-8 rounded-lg bg-blue-500 text-white">1</button>
            <button className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white">2</button>
            <button className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white">3</button>
            <button className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white">4</button>
            <button className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white">5</button>
          </div>
          <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white">
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 
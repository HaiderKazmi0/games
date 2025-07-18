import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaGamepad, FaUsers, FaComment, FaStar, FaFire } from 'react-icons/fa';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getStats() {
  const [totalGames, totalComments, totalUsers, trendingGames, topGames] = await Promise.all([
    prisma.game.count(),
    prisma.comment.count(),
    prisma.user.count(),
    prisma.game.findMany({
      take: 5,
      orderBy: [
        { comments: { _count: 'desc' } },
        { rating: 'desc' }
      ],
      include: {
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
        creator: {
          select: {
            name: true,
          }
        }
      },
    }),
    prisma.game.findMany({
      take: 3,
      orderBy: {
        rating: 'desc',
      },
      include: {
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
        creator: {
          select: {
            name: true,
          }
        }
      },
    }),
  ]);

  return { 
    totalGames, 
    totalComments, 
    totalUsers,
    trendingGames,
    topGames,
  };
}

export default async function Home() {
  const { totalGames, totalComments, totalUsers, trendingGames, topGames } = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/Untitled.png"
          alt="Gaming background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Debris Pulse
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Discover, rate, and discuss your favorite games
          </p>
          <Link
            href="/games"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
          >
            Explore Games
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <FaGamepad className="text-2xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">{totalGames}</h3>
                <p className="text-gray-400">Total Games</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-3 rounded-full">
                <FaComment className="text-2xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">{totalComments}</h3>
                <p className="text-gray-400">Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-full">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">{totalUsers}</h3>
                <p className="text-gray-400">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {totalGames > 0 && (
        <>
          {/* Trending This Month Section */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
                  Trending This Month
                </span>
              </h2>
              <Link
                href="/games"
                className="text-gray-400 hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trendingGames.map((game) => (
                <Link
                  href={`/games/${game.id}`}
                  key={game.id}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-blue-500 transition-all duration-300"
                >
                  <Image
                    src={"/minecraft.jpg"}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                    <FaFire className="text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">Minecraft</h3>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400" />
                      <span className="text-white">{game.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({game._count.comments})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Rated Games Section */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Top Rated Games
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topGames.map((game) => (
                <Link
                  href={`/games/${game.id}`}
                  key={game.id}
                  className="group relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-blue-500 transition-all duration-300"
                >
                  <Image
                    src={"/reddead.jpg"}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-2">Read Dead Redemption 2</h3>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-yellow-400" />
                      <span className="text-white">{game.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({game._count.comments} reviews)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CTA Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to share your gaming experience?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join our community of gamers and start reviewing your favorite games today!
          </p>
          <Link
            href="/games"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

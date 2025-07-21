import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { FaTrophy, FaStar } from 'react-icons/fa';

async function getTopRaters() {
  // Get all users with their rating counts
  const usersWithRatings = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      ratings: {
        select: {
          gameId: true,
        },
      },
    },
    where: {
      ratings: {
        some: {}, 
      },
    },
  });

  // Process the data to count unique games rated
  const topRaters = usersWithRatings
    .map(user => ({
      id: user.id,
      name: user.name,
      gamesRated: new Set(user.ratings.map(rating => rating.gameId)).size,
    }))
    .sort((a, b) => b.gamesRated - a.gamesRated)
    .slice(0, 10); // Get top 10 raters
  
  return topRaters;
}

export default async function LeaderboardPage() {
  const topRaters = await getTopRaters();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/gamingbackground.jpg"
          alt="Gaming background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Top Raters Leaderboard
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            See who's contributing the most to our gaming community
          </p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaTrophy className="text-yellow-400 mr-2" />
              Top Community Members
            </h2>
            <div className="space-y-4">
              {topRaters.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center text-yellow-400">
                        <FaStar className="mr-1" />
                        <span>{user.gamesRated} games rated</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
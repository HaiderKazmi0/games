'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface GameActionsProps {
  game: {
    id: string;
    title: string;
    rating: number;
    _count: {
      votes: number;
      ratings: number;
    };
  };
}

export default function GameActions({ game }: GameActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (value: number) => {
    if (!session) {
      toast.error('Please sign in to vote');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${game.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to vote');
      }

      toast.success('Vote recorded');
      router.refresh();
    } catch (error) {
      console.error('Vote error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (value: number) => {
    if (!session) {
      toast.error('Please sign in to rate');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${game.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate');
      }

      toast.success('Rating recorded');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleVote(1)}
          disabled={isLoading}
          className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span>Upvote</span>
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isLoading}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>Downvote</span>
        </button>
        <span className="text-gray-500">
          {game._count.votes} votes
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-700">Rate this game:</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRating(value)}
              disabled={isLoading}
              className="text-gray-400 hover:text-yellow-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill={value <= game.rating ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          ))}
        </div>
        <span className="text-gray-500">
          ({game._count.ratings} ratings)
        </span>
      </div>
    </div>
  );
} 
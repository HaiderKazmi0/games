'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface DeleteGameButtonProps {
  gameId: string;
}

export default function DeleteGameButton({ gameId }: DeleteGameButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete game');
      }

      // Refresh the current page to reflect the changes
      router.refresh();
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors z-10"
      title="Delete game"
    >
      <FaTrash className={`w-4 h-4 ${isDeleting ? 'opacity-50' : ''}`} />
    </button>
  );
} 
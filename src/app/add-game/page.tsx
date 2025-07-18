'use client';

import AddGameForm from './AddGameForm';

export default function AddGamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Game</h1>
      <AddGameForm />
    </div>
  );
}

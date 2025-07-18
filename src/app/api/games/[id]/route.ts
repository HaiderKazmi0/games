import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the game and check if the current user is the creator
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      select: { creatorId: true }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Get the current user's ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user is the creator of the game
    if (game.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Only the creator can delete this game' },
        { status: 403 }
      );
    }

    // Delete all related records first
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { gameId: params.id }
      }),
      prisma.rating.deleteMany({
        where: { gameId: params.id }
      }),
      prisma.vote.deleteMany({
        where: { gameId: params.id }
      }),
      prisma.game.delete({
        where: { id: params.id }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete game error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
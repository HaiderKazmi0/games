import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
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

    // Verify the game exists
    const game = await prisma.game.findUnique({
      where: { id: params.id }
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { value } = await req.json();

    if (value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Invalid rating value' },
        { status: 400 }
      );
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: params.id,
        },
      },
    });

    if (existingRating) {
      await prisma.rating.update({
        where: {
          userId_gameId: {
            userId: user.id,
            gameId: params.id,
          },
        },
        data: {
          value,
        },
      });
    } else {
      await prisma.rating.create({
        data: {
          userId: user.id,
          gameId: params.id,
          value,
        },
      });
    }

    // Update game's average rating
    const ratings = await prisma.rating.findMany({
      where: { gameId: params.id },
    });

    const averageRating =
      ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length;

    await prisma.game.update({
      where: { id: params.id },
      data: { rating: averageRating },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
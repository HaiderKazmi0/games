import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    if (!session.user) {
      return NextResponse.json(
        { error: 'No user found in session' },
        { status: 401 }
      );
    }

    // Get the current user's ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { title, description, imageUrl } = await req.json();

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        title,
        description,
        imageUrl,
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error('Add game error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
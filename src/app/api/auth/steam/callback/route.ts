import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    // Extract Steam ID from the response
    const steamId = params.get('openid.claimed_id')?.split('/').pop();
    if (!steamId) {
      return NextResponse.redirect(new URL('/auth/error?error=SteamAuth', request.url));
    }

    // Get user info from Steam API
    const userInfo = await getUserInfo(steamId);
    if (!userInfo) {
      return NextResponse.redirect(new URL('/auth/error?error=SteamAuth', request.url));
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: `${steamId}@steam.com` },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `${steamId}@steam.com`,
          name: userInfo.personaname,
          password: '', // No password needed for Steam users
        },
      });
    }

    // Create a session token
    const session = await getServerSession(authOptions);
    if (!session) {
      // If no session exists, create one
      const response = NextResponse.redirect(new URL('/', request.url));
      // Set a cookie to indicate successful Steam login
      response.cookies.set('steam_user_id', steamId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return response;
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Steam auth error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=SteamAuth', request.url));
  }
}

async function getUserInfo(steamId: string) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
  );
  const data = await response.json();
  return data.response.players[0];
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_RETURN_URL = process.env.NEXTAUTH_URL + '/api/auth/steam/callback';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': STEAM_RETURN_URL,
    'openid.realm': process.env.NEXTAUTH_URL!,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return NextResponse.redirect(
    `https://steamcommunity.com/openid/login?${params.toString()}`
  );
} 
'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaDiscord, FaTrophy, FaGoogle, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  return (
    <nav className="shadow sticky top-0 z-50" style={{ background: '#0B0F1A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="https://yptzjmtcknjwrppo.public.blob.vercel-storage.com/Logo_maker_project-removebg-preview-removebg-preview.webp" alt="Logo" width={80} height={80} className="h-20 w-20 rounded-lg" />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-red-600"
                style={{
                  fontFamily: 'Rajdhani, Orbitron, sans-serif',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                Debris Pulse
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-md px-4 py-2 rounded-md bg-[#141A2A] text-[#E0E0E0] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]"
              style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-medium hover:text-[#00C2FF] text-[#E0E0E0] transition-colors" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>Home</Link>
            <Link href="/about" className="font-medium hover:text-[#00C2FF] text-[#E0E0E0] transition-colors" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>About</Link>
            <Link href="/games" className="font-medium hover:text-[#00C2FF] text-[#E0E0E0] transition-colors" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>Games</Link>
            <Link href="/leaderboard" className="flex items-center font-medium hover:text-[#FF4081] text-[#E0E0E0] transition-colors" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>
              <FaTrophy className="mr-1 text-[#FFD700]" /> Leaderboard
            </Link>
            <a href="https://discord.gg/gkH9nsfJ" target="_blank" rel="noopener noreferrer" className="flex items-center font-medium hover:text-[#00C2FF] text-[#E0E0E0] transition-colors" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>
              <FaDiscord className="mr-1 text-[#00C2FF] text-xl" /> Discord
            </a>
            {session ? (
              <>
                <span className="text-gray-300" style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}>{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="ml-2 px-4 py-2 rounded-md bg-[#141A2A] hover:bg-[#FF4081] hover:text-white font-semibold transition"
                  style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif', color: '#E0E0E0' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Google Sign-up Button */}
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center px-4 py-2 rounded-md bg-white hover:bg-gray-100 text-gray-800 font-semibold transition shadow-md"
                  style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}
                >
                  <FaGoogle className="mr-2 text-[#EA4335]" />
                  Sign up with Google
                </button>
                
                {/* All Sign-in Options Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                    className="flex items-center px-4 py-2 rounded-md bg-[#00C2FF] hover:bg-[#FF4081] text-white font-semibold transition"
                    style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}
                  >
                    Sign In
                    <FaChevronDown className="ml-2 text-sm" />
                  </button>
                  
                  {showAuthDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#141A2A] rounded-md shadow-lg border border-gray-700 z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            signIn('google');
                            setShowAuthDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-[#1E2736] text-[#E0E0E0] hover:text-white transition-colors"
                          style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}
                        >
                          <FaGoogle className="mr-3 text-xl text-[#EA4335]" />
                          Continue with Google
                        </button>
                        <button
                          onClick={() => {
                            signIn('discord');
                            setShowAuthDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-[#1E2736] text-[#E0E0E0] hover:text-white transition-colors"
                          style={{ fontFamily: 'Rajdhani, Orbitron, sans-serif' }}
                        >
                          <FaDiscord className="mr-3 text-xl text-[#5865F2]" />
                          Continue with Discord
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay to close dropdown when clicking outside */}
      {showAuthDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAuthDropdown(false)}
        />
      )}
    </nav>
  );
} 
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Providers from '@/components/Providers';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Game Review Platform',
  description: 'A platform for reviewing and discussing games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

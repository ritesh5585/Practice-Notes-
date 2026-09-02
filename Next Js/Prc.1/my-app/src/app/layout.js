// app/layout.js
import './globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'MyStore',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        {/* Navbar */}
        <nav className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              MyStore
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Link href="/product">
                <Button variant="ghost" size="sm">
                  Products
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
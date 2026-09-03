import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'MyStore',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" content="true" />
      </head>
      <body className="min-h-screen bg-background" suppressContentEditableWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {/* Navbar */}
          <Navbar />
          {/* Main Content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
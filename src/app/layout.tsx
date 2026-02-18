import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import ChatBubble from '@/components/chat/ChatBubble';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Luckin Coffee',
  description: 'Order your favorite coffee with Luckin Coffee USA'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.className
        )}
      >
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Toaster position="bottom-right" />
            <main className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col px-5 py-2">
              <Navbar />
              <div className="flex flex-grow flex-col items-center">
                {children}
              </div>
              <Footer />
            </main>
            <ChatBubble />
          </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

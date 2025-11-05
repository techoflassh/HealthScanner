import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'NutriScan Pro',
  description: 'Scan barcodes to get detailed nutritional information.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background h-full">
        <AppProvider>
          <div className="relative flex flex-col h-full md:max-w-2xl md:mx-auto md:border-x">
            <Header />
            <main className="flex-1 overflow-y-auto pb-20 bg-background">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

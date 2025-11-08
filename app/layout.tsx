import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SGA Nomination System',
  description: 'Student Government Association Senator Application and Nomination System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className="h-full overflow-hidden">
        <Navbar />
        <main className="h-[calc(100%-4rem)] overflow-auto">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

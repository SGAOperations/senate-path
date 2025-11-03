import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import MuiThemeProvider from '@/lib/MuiThemeProvider';
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
        <MuiThemeProvider>
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}

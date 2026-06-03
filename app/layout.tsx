import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Landing Page', description: '' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}

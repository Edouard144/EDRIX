import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EDRIX — The infrastructure that rules',
  description: 'Build kingdoms. Ship empires.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
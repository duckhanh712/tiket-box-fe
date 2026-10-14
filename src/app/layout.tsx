import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'Tiketbox', template: '%s · Tiketbox' },
  description: 'Đặt vé sự kiện nhanh chóng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

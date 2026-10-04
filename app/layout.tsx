import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { DbGate } from '@/components/DbGate';
import './globals.css';

export const metadata: Metadata = {
  title: '매일 영단어',
  description: '플래시카드와 간격 반복으로 매일 영어 단어를 외우는 학습 앱',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
          <DbGate>{children}</DbGate>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

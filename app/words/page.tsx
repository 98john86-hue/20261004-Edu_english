import type { Metadata } from 'next';
import { WordManager } from '@/components/WordManager';

export const metadata: Metadata = { title: '단어 관리 | 매일 영단어' };

export default function WordsPage() {
  return <WordManager />;
}

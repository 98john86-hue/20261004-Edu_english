import type { Metadata } from 'next';
import { QuizSession } from '@/components/QuizSession';

export const metadata: Metadata = { title: '퀴즈 | 매일 영단어' };

export default function QuizPage() {
  return <QuizSession />;
}
